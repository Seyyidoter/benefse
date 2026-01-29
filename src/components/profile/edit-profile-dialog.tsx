'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { updateProfile } from '@/lib/user-actions';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
});

interface EditProfileDialogProps {
    children: React.ReactNode;
    initialName?: string | null;
}

export function EditProfileDialog({ children, initialName }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialName || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await updateProfile({ name: values.name });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Profil bilgileriniz güncellendi');
            setOpen(false);
            router.refresh(); // Sayfayı yenile ki yeni isim görünsün
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Profil Bilgilerini Düzenle</DialogTitle>
                    <DialogDescription>
                        Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ad Soyad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Adınız Soyadınız" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
