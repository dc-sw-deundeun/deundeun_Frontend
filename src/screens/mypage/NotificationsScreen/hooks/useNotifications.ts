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
        // 백엔드 데이터에 기본적으로 is_read가 포함되어 있지 않을 수 있으므로 초기값 false 설정
        const items = res.data.items.map((item) => ({
          ...item,
          is_read: item.is_read ?? false,
        }));
        setNotifications(items);
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
      // 로컬 상태 즉시 업데이트
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  return { notifications, loading, handleMarkAsRead };
};

export default useNotifications;
