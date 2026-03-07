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

    @Column()
    currency: string;

    @Column()
    provider: string; // 'STRIPE'

    @Column({ name: 'transaction_id' })
    transactionId: string; // Stripe PaymentIntent ID

    @Column({
        type: 'nvarchar',
        length: 20,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @OneToOne(() => Booking, (booking) => booking.payment)
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column({ type: 'uuid' })
    bookingId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
