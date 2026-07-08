import { useState, useEffect } from 'react';
import { notificationApi, NotificationItem } from '@/api';

// 알림 목록 조회 및 읽음 처리를 담당하는 훅
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.success && res.data && res.data.items) {
        // 읽지 않은 알림만 화면에 표시되도록 필터링
        const unreadItems = res.data.items
          .filter((item) => !item.read_at && !item.is_read)
          .map((item) => ({
            ...item,
            is_read: false,
          }));
        setNotifications(unreadItems);
      }
    } catch (error) {
      console.error('알림 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markNotificationRead(id);
      // 읽음 처리된 알림은 목록에서 즉시 제거 (안 보이도록 처리)
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  return { notifications, loading, handleMarkAsRead };
};

export default useNotifications;
