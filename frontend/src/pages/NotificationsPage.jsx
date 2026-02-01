import { Bell, ShoppingBag, Package, Star, Trash2, Check } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  } = useNotifications();

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNotification(notificationId);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: Package,
      product: ShoppingBag,
      review: Star,
      general: Bell,
    };
    return icons[type] || Bell;
  };

  if (loading) {
    return (
      <ShowLoading
        message="Loading notifications..."
        subMessage="Please wait while we fetch your notifications"
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Notifications
            </h1>
            <p className="text-slate-600">
              Stay updated with your latest activities
              {unreadCount > 0 && (
                <span className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </p>
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-slate-700 flex items-center gap-2"
            >
              <Check size={18} />
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              No Notifications
            </h2>
            <p className="text-slate-600">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const createdDate = new Date(notification.created_at);
              const now = new Date();
              const diffMs = now - createdDate;
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);

              let timeAgo;
              if (diffMins < 60) {
                timeAgo =
                  diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
              } else if (diffHours < 24) {
                timeAgo =
                  diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
              } else {
                timeAgo = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
              }

              return (
                <div
                  key={notification.notification_id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 ${
                    !notification.is_read ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-800 font-semibold mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-slate-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-slate-500 text-sm">{timeAgo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <>
                          <button
                            onClick={() =>
                              handleMarkAsRead(notification.notification_id)
                            }
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5 text-green-600" />
                          </button>
                          <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></div>
                        </>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(notification.notification_id)
                        }
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
