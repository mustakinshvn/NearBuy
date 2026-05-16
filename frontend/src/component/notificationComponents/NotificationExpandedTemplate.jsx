import { Bell, Clock3, Sparkles, Tag, TriangleAlert } from 'lucide-react';

const NotificationExpandedTemplate = ({ notification, timeAgo }) => {
  const isUnread = !notification?.is_read;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-900 px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Notification details
            </div>
            <h4 className="mt-3 text-lg font-bold leading-snug text-white md:text-xl">
              {notification?.title}
            </h4>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              isUnread ? 'bg-amber-400/15 text-amber-200' : 'bg-emerald-400/15 text-emerald-200'
            }`}
          >
            {isUnread ? 'Unread' : 'Read'}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="rounded-2xl bg-slate-50 p-4 text-slate-700">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Bell className="h-4 w-4 text-blue-600" />
            Message
          </div>
          <p className="text-sm leading-7 text-slate-700 md:text-base">
            {notification?.message}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Tag className="h-4 w-4 text-indigo-600" />
              Type
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {notification?.type || 'General'}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <TriangleAlert className="h-4 w-4 text-amber-600" />
              Priority
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {notification?.priority || 'Normal'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
            <Clock3 className="h-4 w-4" />
            Sent {timeAgo}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            Tap the card to collapse
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationExpandedTemplate;