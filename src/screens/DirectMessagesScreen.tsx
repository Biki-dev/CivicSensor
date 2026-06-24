import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Path } from 'react-native-svg';

export default function DirectMessagesScreen() {
  const { user, conversations, directMessages, markConversationAsRead } = useAppStore();
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);

  if (!user) return null;

  const sortedConversations = [...conversations].sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
  });

  const renderConversationItem = ({ item }: { item: typeof conversations[0] }) => {
    const otherParticipantId = item.participantIds[0] === user.id ? item.participantIds[1] : item.participantIds[0];
    const otherName = item.participant1Name === user.displayName ? item.participant2Name : item.participant1Name;
    const otherAvatar = item.participant1Name === user.displayName ? item.participant2Avatar : item.participant1Avatar;
    
    const convoMessages = directMessages.filter(msg => msg.conversationId === item.id);
    const lastMsg = convoMessages[0];
    const unreadCount = convoMessages.filter(msg => !msg.isRead && msg.recipientId === user.id).length;

    return (
      <TouchableOpacity
        style={[styles.conversationCard, selectedConvo === item.id && styles.selectedConvo]}
        onPress={() => {
          setSelectedConvo(item.id);
          markConversationAsRead(item.id);
        }}
      >
        <View style={styles.convoHeader}>
          {otherAvatar ? (
            <Image source={{ uri: otherAvatar }} style={styles.convoAvatar} />
          ) : (
            <View style={styles.convoAvatarPlaceholder} />
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.convoName}>{otherName}</Text>
            {lastMsg && (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {lastMsg.senderId === user.id ? 'You: ' : ''}{lastMsg.text}
              </Text>
            )}
          </View>

          <View style={styles.convoRight}>
            {lastMsg && (
              <Text style={styles.timeText}>
                {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }: { item: typeof directMessages[0] }) => {
    const isCurrentUser = item.senderId === user.id;

    return (
      <View style={[styles.messageRow, isCurrentUser && styles.messageRowRight]}>
        {!isCurrentUser && (
          <>
            {item.senderAvatar ? (
              <Image source={{ uri: item.senderAvatar }} style={styles.messageAvatar} />
            ) : (
              <View style={styles.messageAvatarPlaceholder} />
            )}
          </>
        )}

        <View
          style={[
            styles.messageBubble,
            isCurrentUser && styles.messageBubbleRight,
          ]}
        >
          <Text style={[styles.messageText, isCurrentUser && styles.messageTextRight]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isCurrentUser && styles.messageTimeRight]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  const selectedConversation = conversations.find(c => c.id === selectedConvo);
  const convoMessages = selectedConvo
    ? directMessages.filter(msg => msg.conversationId === selectedConvo).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {!selectedConvo ? (
        <>
          {/* Conversations List Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Direct Messages</Text>
          </View>

          {/* Conversations List */}
          <FlatList
            data={sortedConversations}
            keyExtractor={item => item.id}
            renderItem={renderConversationItem}
            contentContainerStyle={styles.conversationsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke={colors.textMuted}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.emptyText}>No conversations yet. Start a chat!</Text>
              </View>
            }
          />
        </>
      ) : (
        <>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConvo(null)}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke={colors.textOnDark}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            {selectedConversation && (
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderName}>
                  {selectedConversation.participant1Name === user.displayName
                    ? selectedConversation.participant2Name
                    : selectedConversation.participant1Name}
                </Text>
              </View>
            )}

            <View style={{ width: 24 }} />
          </View>

          {/* Messages List */}
          <FlatList
            data={convoMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesList}
            inverted
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyMessageText}>No messages yet. Start the conversation!</Text>
              </View>
            }
          />

          {/* Message Input */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill={colors.brandAccent}>
                <Path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346273 C3.34915502,0.9063653 2.40734225,1.01637077 1.77946707,1.4876629 C0.994623095,2.11604706 0.837654326,3.20545254 1.15159189,3.9909395 L3.03521743,10.4319325 C3.03521743,10.5890299 3.19218622,10.7461273 3.50612381,10.7461273 L16.6915026,11.5316142 C16.6915026,11.5316142 17.1624089,11.5316142 17.1624089,12.0029063 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </Svg>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    backgroundColor: colors.bgDark,
    paddingHorizontal: spacing.screenH,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textOnDark,
    fontWeight: '800',
  },
  conversationsList: {
    padding: spacing.screenH,
  },
  conversationCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.xs,
  },
  selectedConvo: {
    backgroundColor: colors.brandAccent + '15',
    borderWidth: 1.5,
    borderColor: colors.brandAccent,
  },
  convoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  convoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.sm,
  },
  convoAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  convoName: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  lastMessage: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  convoRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  unreadBadge: {
    backgroundColor: colors.brandAccent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  unreadText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  chatHeader: {
    backgroundColor: colors.bgDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  chatHeaderInfo: {
    alignItems: 'center',
  },
  chatHeaderName: {
    ...typography.bodySM,
    color: colors.textOnDark,
    fontWeight: '700',
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: spacing.xs,
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: spacing.sm,
  },
  messageAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageBubbleRight: {
    backgroundColor: colors.brandAccent,
  },
  messageText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  messageTextRight: {
    color: palette.white,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  messageTimeRight: {
    color: palette.white + '80',
  },
  emptyMessageContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyMessageText: {
    ...typography.body,
    color: colors.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
