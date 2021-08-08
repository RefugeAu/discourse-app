import React, { useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { formatRelativeTime } from '../../../helpers';
import { makeStyles, useTheme } from '../../../theme';
import { MessageParticipants, StackNavProp } from '../../../types';

import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { MessageNotification } from './MessageNotification';

type Props = TouchableOpacityProps & {
  id: number;
  message: string;
  messageParticipants: MessageParticipants;
  postPointer: number;
  allowedUserCount?: number | null;
  date: string;
  seen?: boolean;
};

export { Props as MessageCardProps };

export function MessageCard(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    id,
    message,
    messageParticipants: { participantsToShow },
    date,
    seen: seenProps,
    allowedUserCount,
    postPointer,
  } = props;

  const { navigate } = useNavigation<StackNavProp<'MessageDetail'>>();

  const [seen, setSeen] = useState(seenProps);

  const onPressItem = () => {
    if (!seen) {
      setSeen(true);
    }
    navigate('MessageDetail', {
      id,
      postPointer,
      hyperlinkUrl: '',
      hyperlinkTitle: '',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.messageContainer,
        seen && { backgroundColor: colors.backgroundDarker },
      ]}
      onPress={onPressItem}
    >
      <MessageAvatar
        participants={participantsToShow.map(({ avatar, username }) => ({
          avatar,
          username,
        }))}
      />
      <MessageContent
        username={participantsToShow[0].username}
        participantCount={(allowedUserCount || 1) - 1}
        message={message}
      />
      <MessageNotification date={formatRelativeTime(date)} seen={seen} />
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  messageContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
}));
