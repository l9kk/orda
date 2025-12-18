'use client';

import React, { useState } from 'react';
import { Grid2x2PlusIcon, MenuIcon, Bell, User, List, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNotifications } from '@/features/notifications/context/NotificationContext';

export function FloatingHeader() {
	const [open, setOpen] = React.useState(false);
	const { logout, isAuthenticated } = useAuth();
	const { notifications, unreadCount, clearNotifications, markAsRead } = useNotifications();
	const [showNotifications, setShowNotifications] = useState(false);

	const links = [
		{
			label: 'Listings',
			href: '/',
			icon: List,
		},
		{
			label: 'Alerts',
			href: '/alerts',
			icon: Bell,
		},
		{
			label: 'Profile',
			href: '/profile',
			icon: User,
		},
	];

	if (isAuthenticated) {
		links.splice(1, 0, {
			label: 'Create',
			href: '/create',
			icon: PlusCircle,
		});
	}

	return (
		<header
			className={cn(
				'sticky top-5 z-50',
				'mx-auto w-full max-w-3xl rounded-lg border shadow',
				'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg',
			)}
		>
			<nav className="mx-auto flex items-center justify-between p-1.5">
				<Link href="/" className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
					<Grid2x2PlusIcon className="size-5 text-primary" />
					<p className="font-mono text-base font-bold">Orda</p>
				</Link>
				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => (
						<Link
							key={link.label}
							className={buttonVariants({ variant: 'ghost', size: 'sm' })}
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2">
					{isAuthenticated && (
						<div className="relative">
							<Button
								variant="ghost"
								size="icon"
								className="relative"
								onClick={() => setShowNotifications(!showNotifications)}
							>
								<Bell className="size-5" />
								{unreadCount > 0 && (
									<span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
										{unreadCount}
									</span>
								)}
							</Button>

							{showNotifications && (
								<div className="absolute right-0 mt-2 w-80 bg-background rounded-md shadow-lg py-1 z-50 border border-border">
									<div className="px-4 py-2 border-b border-border flex justify-between items-center">
										<span className="font-bold text-foreground">Notifications</span>
										<button 
											onClick={clearNotifications}
											className="text-xs text-primary hover:underline"
										>
											Mark all as read
										</button>
									</div>
									<div className="max-h-64 overflow-y-auto">
										{notifications.length === 0 ? (
											<div className="px-4 py-6 text-center text-muted-foreground text-sm">
												No new alerts
											</div>
										) : (
											notifications.map((n) => (
												<div 
													key={n.id} 
													className={`px-4 py-3 hover:bg-muted/50 border-b border-muted/50 last:border-0 cursor-pointer ${!n.is_read ? 'bg-accent/10' : ''}`}
													onClick={() => {
														markAsRead(n.id);
														setShowNotifications(false);
													}}
												>
													<p className={`text-sm ${!n.is_read ? 'text-primary font-medium' : 'text-foreground'}`}>
														{n.message}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														{new Date(n.created_at).toLocaleString()}
													</p>
												</div>
											))
										)}
									</div>
									<div className="px-4 py-2 border-t border-border text-center">
										<Link 
											href="/alerts" 
											className="text-xs text-primary hover:underline"
											onClick={() => setShowNotifications(false)}
										>
											View all alerts
										</Link>
									</div>
								</div>
							)}
						</div>
					)}

					{isAuthenticated ? (
						<Button size="sm" variant="outline" className="hidden sm:flex" onClick={logout}>Logout</Button>
					) : (
						<Link href="/login">
							<Button size="sm">Login</Button>
						</Link>
					)}
					
					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden"
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
							showClose={false}
							side="left"
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<Link
										key={link.label}
										className={buttonVariants({
											variant: 'ghost',
											className: 'justify-start',
										})}
										href={link.href}
										onClick={() => setOpen(false)}
									>
										<link.icon className="mr-2 size-4" />
										{link.label}
									</Link>
								))}
							</div>
							<SheetFooter>
								{isAuthenticated ? (
									<Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
								) : (
									<>
										<Link href="/login" className="w-full" onClick={() => setOpen(false)}>
											<Button variant="outline" className="w-full">Sign In</Button>
										</Link>
										<Link href="/register" className="w-full" onClick={() => setOpen(false)}>
											<Button className="w-full">Get Started</Button>
										</Link>
									</>
								)}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}
