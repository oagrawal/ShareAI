import React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../provider/AuthProvider";
import Avatar from "../../components/Avatar";
import { supabase } from "../../config/initSupabase";

const Profile = () => {
  const { user, signOut } = useAuth(); // Access user data and signOut function from AuthProvider
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load user images
    fetchAvatarUrl();
  }, [user]);

  const fetchAvatarUrl = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .list(`${user!.id}/avatar`);

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        console.log("No avatar found.");
        return;
      }

      // gets first file, what if there are more avatar pics?
      const avatarFile = data[0].name;
      console.log(`data length is: ${data.length}`);
      // console.log(`avatarFile is: ${avatarFile}`);
      setAvatarUrl(`${user!.id}/avatar/${avatarFile}`);
    } catch (error) {
      if (error instanceof Error) {
        // console.log("Error downloading image: ", error.message);
        console.log("error at fetchAvatarUrl");
      }
    }
  };

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
              // fetchAvatarUrl();
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
