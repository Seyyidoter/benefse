'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/user-actions';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
    email: z.string().email(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    birthDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, setIsPending] = useState(false);

    const nameParts = user?.name?.split(' ') || [];
    const lastNameRaw = nameParts.length > 1 ? nameParts.pop() : '';
    const firstNameRaw = nameParts.join(' ');

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: firstNameRaw || '',
            lastName: lastNameRaw || '',
            email: user?.email || '',
            phone: user?.phone || '',
            gender: user?.gender || 'UNSPECIFIED',
            birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsPending(true);
        try {
            const result = await updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                gender: data.gender,
                birthDate: data.birthDate
            });

            if (result.success) {
                toast.success('Profil güncellendi');
            } else {
                toast.error(result.error || 'Güncelleme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adınız*</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Soyadınız*</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-posta*</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled className="bg-muted text-muted-foreground" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="05XX XXX XX XX" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Doğum Tarihi</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Cinsiyet</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-4 pt-1">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FEMALE" id="r1" />
                                                <Label htmlFor="r1">Kadın</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="MALE" id="r2" />
                                                <Label htmlFor="r2">Erkek</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="UNSPECIFIED" id="r3" />
                                                <Label htmlFor="r3">Belirtmek İstemiyorum</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Button type="submit" disabled={isPending} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white min-w-[150px]">
                        {isPending ? 'Güncelleniyor...' : 'Bilgilerimi Güncelle'}
                    </Button>
                    <Button type="button" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                        Üyeliğimi İptal Et
                    </Button>
                </div>
            </form>
        </Form>
    );
}
