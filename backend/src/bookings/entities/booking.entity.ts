import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'datetime' }) // MSSQL uses datetime
    startDate: Date;

    @Column({ type: 'datetime' })
    endDate: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({
        type: 'nvarchar',
        length: 20,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid' }) // Explicit foreign key column for efficient querying
    userId: string;

    @ManyToOne(() => Car, (car) => car.id)
    @JoinColumn({ name: 'carId' })
    car: Car;

    @Column({ type: 'uuid' }) // Explicit foreign key column
    carId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Payment, (payment) => payment.booking) // Circular dependency handled by lazy loading or forwardRef if needed, usually fine here.
    payment: Payment;
}
