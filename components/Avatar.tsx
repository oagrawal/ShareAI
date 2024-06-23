import { useState, useEffect } from "react";
import { supabase } from "../config/initSupabase";
import { StyleSheet, View, Alert, Image, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../provider/AuthProvider";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };
  const { user } = useAuth();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      // setUploading(false);

      const { data, error } = await supabase.storage
        .from("files")
        .download(path);

      // console.log(`path at the start of downloadImage: ${path}`);

      //   const { data, error } = await supabase.storage
      //     .from("files")
      //     .list(`${user!.id}/avatar/`);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
      // setUploading(false);
    } catch (error) {
      if (error instanceof Error) {
        // console.log("Error downloading image: ", error.message);
        console.log("Error downloading image");
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        // console.log("User cancelled image picker.");
        console.log("error at uploadAvatar");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      /* 
        const onSelectImage = async () => {
            const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            };

            const result = await ImagePicker.launchImageLibraryAsync(options);

            // Save image if not cancelled
            if (!result.canceled) {
            const img = result.assets[0];
            const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
            const filePath = `${user!.id}/${c}.${img.type === 'image' ? 'png' : 'mp4'}`;
            const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
            await supabase.storage.from('files').upload(filePath, decode(base64), { contentType });
            loadImages();
            }
         };


         await supabase.storage.from('bucket_name').upload('file_path', file, {
            upsert: true,
          })


      */

      // const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      // const path = `${user!.id}/avatar/${user!.id}_avatar.${fileExt}`;
      // const path = `${user!.id}/avatar/${new Date().getTime()}.${fileExt}`;
      // if (){

      // }
      // List and delete all files in the avatar directory
      const { data: listData, error: listError } = await supabase.storage
        .from("files")
        .list(`${user!.id}/avatar/`);

      if (listError) {
        throw listError;
      }

      if (listData && listData.length > 0) {
        // Start deleting from index 0
        console.log("deleting files!");
        for (let i = 0; i < listData.length; i++) {
          const file = listData[i];
          console.log(`trying to remove ${user!.id}/avatar/${file.name}`);

          const { error: deleteError } = await supabase.storage
            .from("files")
            .remove([`${user!.id}/avatar/${file.name}`]);

          if (deleteError) {
            throw deleteError;
          }
        }
      }
      const path = `${user!.id}/avatar/${new Date().getTime()}.png`;

      const { data, error: uploadError } = await supabase.storage
        .from("files")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/png",
          // upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
      if (url) downloadImage(url);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  // console.log(`avatarUrl before returning avatar = ${avatarUrl}`);

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          title={uploading ? "Uploading ..." : "Upload Profile Picture"}
          onPress={uploadAvatar}
          disabled={uploading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
});
