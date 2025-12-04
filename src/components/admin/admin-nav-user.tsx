"use client"

import { Crown, Home, LayoutDashboard, LogOut, Settings, CreditCard } from "lucide-react"
import Link from "next/link"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminNavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
    subscription_tier?: string
    role?: string
  }
}

export function AdminNavUser({ user }: AdminNavUserProps) {
  const isPaid = user.subscription_tier !== 'free'

  // Get initials for avatar fallback (first + last name)
  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return '?'

    return name
      .trim()
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Check if avatar URL is valid and not blank
  const hasValidAvatar = user.avatar && user.avatar.trim() !== '' && !user.avatar.includes('d=blank')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8 rounded-lg">
            {hasValidAvatar && (
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <AvatarFallback className="rounded-lg bg-orchid text-white text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left text-sm leading-tight hidden md:block">
            <div className="font-medium truncate max-w-[120px]">{user.name}</div>
          </div>
          <Badge
            variant="outline"
            className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
          >
            {user.role}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg bg-white border shadow-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex flex-col gap-2 px-3 py-2">
            {/* Tier Badge */}
            <div className="flex justify-start">
              <Badge
                variant={isPaid ? 'default' : 'secondary'}
                className={`text-xs px-2 py-0.5 ${isPaid ? 'bg-blue-600' : ''}`}
              >
                {isPaid ? (
                  <>
                    <Crown className="h-2.5 w-2.5 mr-1" />
                    {user.subscription_tier?.toUpperCase()}
                  </>
                ) : (
                  'FREE'
                )}
              </Badge>
            </div>
            {/* User Info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                {hasValidAvatar && (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <AvatarFallback className="rounded-lg bg-orchid text-white text-sm font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to App
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account?tab=billing" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center text-red-600 focus:text-red-600 w-full cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
