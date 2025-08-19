"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import Swal from "sweetalert2";
import { fetchData } from "@/lib/api";
import { useEffect } from "react";
import { Globe } from "lucide-react";
import {
	BookOpen,
	CreditCard,
	GraduationCap,
	Home,
	Settings,
	Users,
	BarChart3,
	FileText,
	Award,
	MessageSquare,
	Video,
	Moon,
	Sun,
	LogOut,
	User,
	ChevronDown,
	Plus,
	DollarSign,
	X,
	ShoppingCart,
	UserPlus,
	Share2,
	FileIcon as FileUser,
	HelpCircle,
	Search,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
	userRole: "admin" | "instructor" | "student" | "reviewer";
	userEmail: string;
	darkMode: boolean;
	onToggleDarkMode: () => void;
	onLogout: () => void;
	onNavigate: (page: string) => void;
	isMobile?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
}

interface UserData {
	name: string;
	email: string;
	avatar: string;
	roles: string[];
}

export function AppSidebar({
	userRole,
	userEmail,
	darkMode,
	onLogout,
	onNavigate,
	isMobile = false,
	isOpen = false,
	onClose,
}: AppSidebarProps) {
	const router = useRouter();
	const { items } = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [userData, setUserData] = useState<UserData | null>(null);

	const onToggleDarkMode = () => {
		const html = document.documentElement;
		const isDark = html.classList.contains("dark");

		if (isDark) {
			html.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			html.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}
	};

	const handleLogout = async () => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You will be logged out from your account",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#1e40af",
			cancelButtonColor: "#dc2626",
			confirmButtonText: "Yes, logout!",
			cancelButtonText: "Cancel",
			reverseButtons: true,
			customClass: {
				popup: "rounded-lg",
				title: "text-lg font-semibold",
				content: "text-sm text-gray-600",
				confirmButton: "px-6 py-2 rounded-lg font-medium",
				cancelButton: "px-6 py-2 rounded-lg font-medium",
			},
		});

		if (result.isConfirmed) {
			// Show logout notification
			await Swal.fire({
				title: "Logged Out!",
				text: "You have been successfully logged out",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
				customClass: {
					popup: "rounded-lg",
					title: "text-lg font-semibold",
					content: "text-sm text-gray-600",
				},
			});

			// ✅ Hapus token dari localStorage dan cookie
			localStorage.removeItem("access_token");
			document.cookie = "access_token=; Max-Age=0; path=/;";

			// Optional: hapus user info
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userRole");
      localStorage.removeItem("userInfo");

			// Redirect ke halaman login
			router.push("/login");
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(
				`/student/browse-courses?q=${encodeURIComponent(searchQuery.trim())}`
			);
			setSearchQuery("");
			if (isMobile && onClose) {
				onClose();
			}
		}
	};

	const handleNavigation = (page: string) => {
		if (page === "dashboard") {
			router.push(`/${userRole}/dashboard`);
		} else if (page === "my-learning" && userRole === "student") {
			router.push(`/${userRole}/dashboard?tab=learning`);
		} else if (page.startsWith("category-")) {
			router.push(`/student/${page}`);
		} else {
			router.push(`/${userRole}/${page}`);
		}

		if (isMobile && onClose) {
			onClose();
		}
	};

	const getMenuItems = () => {
		const commonItems = [{ title: "Dashboard", icon: Home, page: "dashboard" }];

		const roleSpecificItems = {
			admin: [
				{ title: "User Management", icon: Users, page: "user-management" },
				{
					title: "Course Management",
					icon: BookOpen,
					page: "course-management",
				},
				{ title: "Payment Gateway", icon: CreditCard, page: "payment-gateway" },
				{ title: "Revenue Reports", icon: BarChart3, page: "revenue-reports" },
				{ title: "System Settings", icon: Settings, page: "system-settings" },
			],
			instructor: [
				{ title: "Create Course", icon: Plus, page: "create-course" },
				{ title: "My Courses", icon: BookOpen, page: "my-courses" },
				{ title: "Students", icon: Users, page: "students" },
				// { title: "Analytics", icon: BarChart3, page: "analytics" },
				{
					title: "Live Classes",
					icon: Video,
					page: "live-classes",
					comingSoon: true,
				},
				{ title: "Income", icon: DollarSign, page: "income" },
				{ title: "CV Maker", icon: FileUser, page: "cv-maker" },
				{ title: "Help", icon: HelpCircle, page: "help" },
				{ title: "Profile", icon: User, page: "profile" },
			],
			student: [
				{ title: "Browse Courses", icon: BookOpen, page: "browse-courses" },
				{ title: "My Learning", icon: GraduationCap, page: "my-learning" },
				{ title: "Certificates", icon: Award, page: "certificates" },
				{ title: "Progress", icon: BarChart3, page: "progress" },
				{
					title: "CV Maker",
					icon: FileUser,
					page: "cv-maker",
					comingSoon: true,
				},
				{ title: "Referral", icon: Share2, page: "referral" },
				{
					title: "Become Instructor",
					icon: UserPlus,
					page: "become-instructor",
				},
				{ title: "Help", icon: HelpCircle, page: "help" },
				{ title: "Profile", icon: User, page: "profile" },
			],
			reviewer: [
				{ title: "Review Courses", icon: FileText, page: "review-courses" },
				{ title: "Feedback", icon: MessageSquare, page: "feedback" },
				{ title: "Reports", icon: BarChart3, page: "reports" },
			],
		};

		return [...commonItems, ...roleSpecificItems[userRole]];
	};

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

		setUserData({
			email: userInfo.email,
			roles: userInfo.roles,
			name: userInfo.fullname,
			avatar: userInfo.avatar ?? "/placeholder.svg?height=32&width=32",
		});
	}, []);

	const getRoleTitle = () => {
		switch (userRole) {
			case "admin":
				return "Admin Dashboard";
			case "instructor":
				return "Instructor Dashboard";
			case "student":
				return "Student Dashboard";
			case "reviewer":
				return "Reviewer Dashboard";
			default:
				return "Dashboard";
		}
	};

	if (isMobile) {
		return (
			<>
				{/* Mobile Overlay */}
				{isOpen && (
					<div
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={onClose}
					/>
				)}

				{/* Mobile Sidebar - Fix scrolling */}
				<div
					className={`
            fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
				>
					{/* Mobile Header - Fixed */}
					<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
						<div className="flex items-center space-x-3 min-w-0 flex-1">
							<div className="w-8 h-8 bg-midnight-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
								<GraduationCap className="w-5 h-5 text-white" />
							</div>
							<div className="min-w-0 flex-1">
								<h2 className="text-lg font-bold text-midnight-blue-800 truncate">
									EduLMS
								</h2>
								<p className="text-sm text-midnight-blue-600 capitalize truncate">
									{userRole}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 flex-shrink-0">
							{/* Cart Button for Students */}
							{userRole === "student" && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsCartOpen(true)}
									className="relative hover:bg-gray-100"
								>
									<ShoppingCart className="w-5 h-5 text-gray-600" />
									{items && items.length > 0 && (
										<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{items.length}
										</span>
									)}
								</Button>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="hover:bg-gray-100"
							>
								<X className="w-5 h-5 text-gray-600" />
							</Button>
						</div>
					</div>

					{/* Search Form for Students - Fixed */}
					{userRole === "student" && (
						<div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
							<form onSubmit={handleSearch} className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight-blue-500 focus:border-transparent text-sm"
								/>
							</form>
						</div>
					)}

					{/* Mobile Dashboard Title - Fixed */}
					<div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
						<h3 className="text-lg font-semibold text-midnight-blue-800 truncate">
							{getRoleTitle()}
						</h3>
						<p className="text-sm text-midnight-blue-600 truncate">
							Manage your{" "}
							{userRole === "instructor"
								? "courses and students"
								: userRole === "student"
								? "learning journey"
								: "platform"}
						</p>
					</div>

					{/* Mobile Menu - Scrollable */}
					<div className="flex-1 overflow-y-auto p-4 bg-white">
						<div className="space-y-2">
							{getMenuItems().map((item) => (
								<button
									key={item.title}
									onClick={() => handleNavigation(item.page)}
									className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left transition-colors"
								>
									<div className="flex items-center space-x-3 min-w-0 flex-1">
										<item.icon className="w-5 h-5 text-midnight-blue-600 flex-shrink-0" />
										<span className="font-medium text-midnight-blue-800 truncate">
											{item.title}
										</span>
									</div>
									{item.comingSoon && (
										<Badge
											variant="secondary"
											className="text-xs flex-shrink-0 ml-2"
										>
											Coming Soon
										</Badge>
									)}
								</button>
							))}
						</div>

						{userRole === "student" && (
							<div className="mt-6">
								<h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
									Quick Access
								</h4>
								<Collapsible>
									<CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100">
										<div className="flex items-center space-x-3 min-w-0 flex-1">
											<BookOpen className="w-5 h-5 text-midnight-blue-600 flex-shrink-0" />
											<span className="font-medium text-midnight-blue-800 truncate">
												Categories
											</span>
										</div>
										<ChevronDown className="w-4 h-4 text-midnight-blue-600 flex-shrink-0" />
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-2 ml-8 space-y-1">
										{[
											"Web Development",
											"Mobile Development",
											"UI/UX Design",
											"Data Science",
										].map((category) => (
											<button
												key={category}
												onClick={() =>
													handleNavigation(
														`category-${category
															.toLowerCase()
															.replace(/\s+/g, "-")}`
													)
												}
												className="w-full text-left p-2 text-sm text-midnight-blue-700 hover:text-midnight-blue-900 hover:bg-gray-50 rounded truncate"
											>
												{category}
											</button>
										))}
									</CollapsibleContent>
								</Collapsible>
							</div>
						)}
					</div>

					{/* Mobile Footer - Fixed */}
					<div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
									<Avatar className="w-8 h-8 flex-shrink-0">
										<AvatarImage src="/placeholder-avatar.jpg" />
										<AvatarFallback className="bg-midnight-blue-800 text-white text-sm">
											{userEmail.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 text-left min-w-0">
										<p className="text-sm font-medium text-midnight-blue-800 truncate">
											{userEmail}
										</p>
										<p className="text-xs text-midnight-blue-600 capitalize truncate">
											{userRole}
										</p>
									</div>
									<ChevronDown className="w-4 h-4 text-midnight-blue-600 flex-shrink-0" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuItem>
									<User className="w-4 h-4 mr-2" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="w-4 h-4 mr-2" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={onToggleDarkMode}>
									{darkMode ? (
										<Sun className="w-4 h-4 mr-2" />
									) : (
										<Moon className="w-4 h-4 mr-2" />
									)}
									{darkMode ? "Light Mode" : "Dark Mode"}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="text-red-600 focus:text-red-600"
								>
									<LogOut className="w-4 h-4 mr-2" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Cart Sidebar */}
				<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
			</>
		);
	}

	return (
		<>
			<Sidebar className="border-r border-midnight-blue-200">
				<SidebarHeader className="border-b border-midnight-blue-200 p-4">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center space-x-2">
										<div className="w-8 h-8 bg-midnight-blue-800 rounded-lg flex items-center justify-center">
											<GraduationCap className="w-5 h-5 text-white" />
										</div>
										<div className="min-w-0">
											<h2 className="text-lg font-bold text-midnight-blue-800 truncate">
												EduLMS
											</h2>
											<p className="text-xs text-midnight-blue-600 capitalize">
												{userRole}
											</p>
										</div>
									</div>
									{/* Cart Button for Students */}
									{userRole === "student" && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsCartOpen(true)}
											className="relative hover:bg-midnight-blue-50"
										>
											<ShoppingCart className="w-5 h-5 text-midnight-blue-600" />
											{items && items.length > 0 && (
												<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
													{items.length}
												</span>
											)}
										</Button>
									)}
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>

					{/* Search Form for Students - Desktop */}
					{userRole === "student" && (
						<div className="mt-4">
							<form onSubmit={handleSearch} className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight-blue-500 focus:border-transparent text-sm"
								/>
							</form>
						</div>
					)}
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{getMenuItems().map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											onClick={() => handleNavigation(item.page)}
											className="hover:bg-midnight-blue-50 flex items-center justify-between w-full"
										>
											<div className="flex items-center">
												<item.icon className="w-4 h-4 mr-2" />
												<span className="truncate">{item.title}</span>
											</div>
											{item.comingSoon && (
												<Badge variant="secondary" className="text-xs ml-2">
													Coming Soon
												</Badge>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					{userRole === "student" && (
						<SidebarGroup>
							<SidebarGroupLabel>Quick Access</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<Collapsible>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton>
													<BookOpen className="w-4 h-4" />
													<span>Categories</span>
													<ChevronDown className="ml-auto w-4 h-4" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{[
														"Web Development",
														"Mobile Development",
														"UI/UX Design",
														"Data Science",
													].map((category) => (
														<SidebarMenuSubItem key={category}>
															<SidebarMenuSubButton
																onClick={() =>
																	handleNavigation(
																		`category-${category
																			.toLowerCase()
																			.replace(/\s+/g, "-")}`
																	)
																}
															>
																<span className="truncate">{category}</span>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					)}
				</SidebarContent>

				<SidebarFooter className="border-t border-midnight-blue-200">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={userData?.avatar || "/placeholder.svg"}
										alt={userData?.name}
									/>
									<AvatarFallback className="rounded-lg bg-midnight-blue-800 text-white">
                    {userData?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{userData?.name}
									</span>
									<span className="truncate text-xs">
										{userData?.email}
									</span>
								</div>
								<ChevronDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side="bottom"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuItem>
								<User className="w-4 h-4 mr-2" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="w-4 h-4 mr-2" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onToggleDarkMode}>
								{darkMode ? (
									<Sun className="w-4 h-4 mr-2" />
								) : (
									<Moon className="w-4 h-4 mr-2" />
								)}
								{darkMode ? "Light Mode" : "Dark Mode"}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-red-600 focus:text-red-600"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			{/* Cart Sidebar */}
			<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</>
	);
}
