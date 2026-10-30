import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'datetime' })
    startDate: Date;

    @Column({ type: 'datetime' })
    endDate: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({
        type: 'varchar',
        length: 20,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({ name: 'customer_name', nullable: true })
    customerName: string;

    @Column({ name: 'customer_phone', nullable: true })
    customerPhone: string;

    @Column({ name: 'customer_email', nullable: true })
    customerEmail: string;

    @Column({ name: 'identity_number', nullable: true })
    identityNumber: string;

    @Column({ name: 'insurance_type', default: 'STANDART' })
    insuranceType: string;

    @Column('decimal', { name: 'insurance_price', precision: 10, scale: 2, default: 0 })
    insurancePrice: number;

    @Column({ type: 'int', default: 1 })
    days: number;

    @Column({ name: 'merchant_oid', nullable: true })
    merchantOid: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: string | null;

    @ManyToOne(() => Car, (car) => car.id)
    @JoinColumn({ name: 'carId' })
    car: Car;

    @Column()
    carId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Payment, (payment) => payment.booking, { nullable: true })
    payment: Payment;
}
