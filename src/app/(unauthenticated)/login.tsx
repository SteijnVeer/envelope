import { Rounded } from '@steijnveer/expo-commons/constants';
import { AppleAuthenticationButton, AppleAuthenticationButtonStyle, AppleAuthenticationButtonType, AppleAuthenticationScope, isAvailableAsync, signInAsync } from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Login() {
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    isAvailableAsync().then(setAppleAuthAvailable);
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {appleAuthAvailable ? (
        <AppleAuthenticationButton
          onPress={async () => {
            try {
              const credential = await signInAsync({
                requestedScopes: [
                  AppleAuthenticationScope.FULL_NAME,
                  AppleAuthenticationScope.EMAIL,
                ],
                state: 'random-state-string',
                nonce: 'random-nonce-string',
              });
              // signed in
            } catch (e: any) {
              if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
          buttonType={AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthenticationButtonStyle.BLACK}
          style={{
            width: '100%',
            height: 44,
          }}
          cornerRadius={Rounded.pill.borderRadius as number}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 44,
            backgroundColor: 'black',
            ...Rounded.pill,
          }}
        />
      )}
    </ScrollView>
  );
}
