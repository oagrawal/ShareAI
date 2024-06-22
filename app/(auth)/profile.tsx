import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../provider/AuthProvider';

const Profile = () => {
  const { user, signOut } = useAuth(); // Access user data and signOut function from AuthProvider

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      {user && (
        <View>
          <Text>Welcome, {user.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Profile;
