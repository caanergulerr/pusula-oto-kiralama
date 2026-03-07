import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column({ unique: true, nullable: true })
    plateNumber: string;

    @Column('decimal', { precision: 10, scale: 2 })
    dailyPrice: number;

    @Column({ default: 1 })
    totalStock: number;

    @Column({ default: 1 })
    availableStock: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    kmLimit: number;

    @Column('nvarchar', { length: 'MAX', nullable: true })
    description: string;

    @Column('nvarchar', { length: 'MAX', nullable: true })
    features: string; // Stored as JSON string (GPS, Bluetooth, etc.)

    @Column('nvarchar', { length: 'MAX', nullable: true })
    specs: string; // Stored as JSON string

    @OneToMany(() => Booking, (booking) => booking.car)
    bookings: Booking[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
