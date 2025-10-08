import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Friend {
  id: number;
  username: string;
  online: boolean;
}

interface FriendsListProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
}

const FriendsList = ({ friends, selectedFriend, onSelectFriend }: FriendsListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {friends.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No friends yet. Add some friends to start chatting!
          </div>
        ) : (
          friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className={cn(
                "w-full p-3 rounded-lg flex items-center gap-3 transition-colors hover:bg-muted",
                selectedFriend?.id === friend.id && "bg-muted"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-secondary">
                    {friend.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {friend.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{friend.username}</p>
                <p className="text-xs text-muted-foreground">
                  {friend.online ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default FriendsList;
