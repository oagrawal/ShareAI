import React from "react";
import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../provider/AuthProvider";
import Avatar from "../../components/Avatar";

const Profile = () => {
  const { user, signOut } = useAuth(); // Access user data and signOut function from AuthProvider
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      {user && (
        <View>
          <Avatar
            size={200}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
            }}
          />
          <Text style={{ color: "#fff" }}>Welcome, {user.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151515",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
});

export default Profile;
