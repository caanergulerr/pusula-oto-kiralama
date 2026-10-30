import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

export enum PaymentStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    PENDING = 'PENDING',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'TL' })
    currency: string;

    @Column({ default: 'PAYTR' })
    provider: string; // 'PAYTR'

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string; // PayTR payment id or transaction ref

    @Column({ name: 'merchant_oid', nullable: true })
    merchantOid: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({ name: 'error_message', nullable: true, type: 'text' })
    errorMessage: string | null;

    @OneToOne(() => Booking, (booking) => booking.payment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column()
    bookingId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
