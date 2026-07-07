import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Text from '@/components/Text';
import { X } from 'lucide-react-native';
import { styles } from '../CheckupOcrScreen.styles';

interface UploadedImageListProps {
  images: string[];
  onThumbnailPress: () => void;
  onRemove: (index: number) => void;
}

export const UploadedImageList: React.FC<UploadedImageListProps> = ({
  images,
  onThumbnailPress,
  onRemove,
}) => {
  if (images.length === 0) return <View style={styles.uploadedListContainer} />;

  return (
    <View style={styles.uploadedListContainer}>
      <Text style={styles.uploadedListTitle}>
        스캔된 검진지 ({images.length}/10)
      </Text>
      <View style={styles.uploadedList}>
        {images.map((img, index) => (
          <View key={index} style={styles.uploadedItem}>
            <TouchableOpacity style={styles.uploadedItemLeft} onPress={onThumbnailPress}>
              <Image source={{ uri: img }} style={styles.uploadedThumbnail} />
              <Text style={styles.uploadedItemName}>검진지 이미지 {index + 1}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadedDeleteBtn}
              onPress={() => onRemove(index)}
            >
              <X color="#808080" size={20} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default UploadedImageList;
