import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface PaytrTokenRequest {
    userIp: string;
    merchantOid: string;
    email: string;
    paymentAmount: number; // in TL (will be multiplied by 100 for kurus)
    userName: string;
    userAddress: string;
    userPhone: string;
    basketItems: Array<[string, string, number]>; // [title, priceInTL, quantity]
}

export class PaytrCallbackDto {
    merchant_oid: string;
    status: 'success' | 'failed';
    total_amount: string;
    hash: string;
    failed_reason_code?: string;
    failed_reason_msg?: string;
    payment_type?: string;
    currency?: string;
    merchant_id?: string;
}

@Injectable()
export class PaytrService {
    private readonly logger = new Logger(PaytrService.name);

    constructor(private readonly configService: ConfigService) { }

    private getMerchantCredentials() {
        const merchantId = this.configService.get<string>('PAYTR_MERCHANT_ID') || 'test_merchant_id';
        const merchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY') || 'test_merchant_key';
        const merchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT') || 'test_merchant_salt';
        const testMode = this.configService.get<string>('PAYTR_TEST_MODE') || '1';
        return { merchantId, merchantKey, merchantSalt, testMode };
    }

    async getIframeToken(reqData: PaytrTokenRequest): Promise<{ token: string; iframeUrl: string }> {
        const { merchantId, merchantKey, merchantSalt, testMode } = this.getMerchantCredentials();
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

        // Format user IP (clean localhost / IPv6)
        let clientIp = reqData.userIp;
        if (!clientIp || clientIp === '::1' || clientIp.includes('127.0.0.1')) {
            clientIp = '85.105.1.1'; // Default valid IPv4 for local testing
        } else if (clientIp.includes('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }

        const paymentAmountInKurus = Math.round(Number(reqData.paymentAmount) * 100);
        const userBasket = Buffer.from(JSON.stringify(reqData.basketItems)).toString('base64');
        const noInstallment = '0';
        const maxInstallment = '0';
        const currency = 'TL';
        const debugOn = testMode === '1' ? '1' : '0';
        const timeoutLimit = '30';

        const merchantOkUrl = `${frontendUrl}/odeme/basarili?oid=${encodeURIComponent(reqData.merchantOid)}`;
        const merchantFailUrl = `${frontendUrl}/odeme/hata?oid=${encodeURIComponent(reqData.merchantOid)}`;

        // Hash generation:
        // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
        const hashStr = `${merchantId}${clientIp}${reqData.merchantOid}${reqData.email}${paymentAmountInKurus}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
        const paytrToken = crypto
            .createHmac('sha256', merchantKey)
            .update(hashStr + merchantSalt)
            .digest('base64');

        const params = new URLSearchParams();
        params.append('merchant_id', merchantId);
        params.append('user_ip', clientIp);
        params.append('merchant_oid', reqData.merchantOid);
        params.append('email', reqData.email);
        params.append('payment_amount', paymentAmountInKurus.toString());
        params.append('paytr_token', paytrToken);
        params.append('user_basket', userBasket);
        params.append('debug_on', debugOn);
        params.append('no_installment', noInstallment);
        params.append('max_installment', maxInstallment);
        params.append('user_name', reqData.userName || 'Müşteri');
        params.append('user_address', reqData.userAddress || 'Elazığ Merkez');
        params.append('user_phone', reqData.userPhone || '05536198164');
        params.append('merchant_ok_url', merchantOkUrl);
        params.append('merchant_fail_url', merchantFailUrl);
        params.append('timeout_limit', timeoutLimit);
        params.append('currency', currency);
        params.append('test_mode', testMode);

        this.logger.log(`Requesting PayTR token for oid=${reqData.merchantOid}, amount=${reqData.paymentAmount} TL`);

        try {
            const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.logger.log(`PayTR token successfully generated for oid=${reqData.merchantOid}`);
                return {
                    token: data.token,
                    iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
                };
            } else {
                this.logger.warn(`PayTR API returned failure: ${data.reason || JSON.stringify(data)}`);
                
                // If using mock/test credentials locally, return simulated token for smooth local verification
                if (merchantId.includes('test') || merchantId.includes('mock') || !this.configService.get<string>('PAYTR_MERCHANT_KEY')) {
                    const mockToken = `mock_paytr_${reqData.merchantOid}`;
                    this.logger.warn(`Development mode active with placeholder credentials: returning mock token ${mockToken}`);
                    return {
                        token: mockToken,
                        iframeUrl: `https://www.paytr.com/odeme/guvenli/${mockToken}`,
                    };
                }

                throw new BadRequestException(`PayTR Token Hatası: ${data.reason || 'Bilinmeyen hata'}`);
            }
        } catch (error: any) {
            this.logger.error(`PayTR get-token connection error: ${error.message}`);
            
            // Fallback for local testing without network/PayTR access
            if (this.configService.get<string>('NODE_ENV') !== 'production') {
                const mockToken = `mock_paytr_${reqData.merchantOid}`;
                return {
                    token: mockToken,
                    iframeUrl: `https://www.paytr.com/odeme/guvenli/${mockToken}`,
                };
            }

            throw new BadRequestException(`Ödeme servisine bağlanılamadı: ${error.message}`);
        }
    }

    verifyCallbackHash(body: PaytrCallbackDto): boolean {
        const { merchantKey, merchantSalt } = this.getMerchantCredentials();
        
        // Callback hash: merchant_oid + merchant_salt + status + total_amount
        const hashStr = `${body.merchant_oid}${merchantSalt}${body.status}${body.total_amount}`;
        const calculatedHash = crypto
            .createHmac('sha256', merchantKey)
            .update(hashStr)
            .digest('base64');

        const isValid = calculatedHash === body.hash;
        if (!isValid) {
            this.logger.warn(`PayTR callback hash mismatch! calculated=${calculatedHash}, received=${body.hash}`);
        }
        return isValid;
    }
}
