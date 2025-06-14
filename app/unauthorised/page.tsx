export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md">
        You do not have permission to view this page. If you believe this is a mistake, contact the system administrator.
      </p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back to Dashboard
      </a>
    </div>
  );
}
// app/unauthorised/page.tsx
// This page displays a simple "Access Denied" message for unauthorized users.