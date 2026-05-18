import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"

type UserAvatarProps = {
  fullName: string
  avatarUrl?: string
  size?: "default" | "sm" | "lg"
  className?: string
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export const UserAvatar = ({
  fullName,
  avatarUrl,
  size = "default",
  className,
}: UserAvatarProps) => {
  return (
    <Avatar size={size} className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  )
}
