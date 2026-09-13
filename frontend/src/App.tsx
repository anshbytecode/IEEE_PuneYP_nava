import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from './context/AuthContext';
import { AdminLayout } from './components/Layout/AdminLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { PublicEventDetail } from './pages/PublicEventDetail';
import { PublicLayout } from './components/Layout/PublicLayout';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import { PublicAbout } from './pages/PublicAbout';
import { PublicExeCom } from './pages/PublicExeCom';
import { PublicBlogs } from './pages/PublicBlogs';
import { PublicBlogDetail } from './pages/PublicBlogDetail';
import { PublicGallery } from './pages/PublicGallery';
import { PublicContact } from './pages/PublicContact';
import { PublicGrants } from './pages/PublicGrants';
import { Dashboard } from './pages/Dashboard';
import { EventList } from './pages/Events/EventList';
import { EventForm } from './pages/Events/EventForm';
import { BlogList } from './pages/Blogs/BlogList';
import { BlogForm } from './pages/Blogs/BlogForm';
import { TeamList } from './pages/Team/TeamList';
import { TeamForm } from './pages/Team/TeamForm';
import { GalleryManager } from './pages/Gallery/GalleryManager';
import { AnnouncementList } from './pages/Announcements/AnnouncementList';
import { SubscriberList } from './pages/Subscribers/SubscriberList';
import { ContactList } from './pages/Contacts/ContactList';
import { GrantList } from './pages/Grants/GrantList';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, admin } = useAuth();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)', gap: '16px' }}>
        <Spin size="large" />
        <div style={{ color: 'var(--text-muted)' }}>Verifying credentials...</div>
      </div>
    );
  }

  const isIEEE = admin && (
    admin.email.toLowerCase().endsWith('@ieee.org') ||
    admin.email.toLowerCase().endsWith('@ieeepune.org')
  );

  return isAuthenticated && isIEEE ? <>{children}</> : <Navigate to="/" replace />;
};

// Guest Route Guard (Redirects to dashboard or home if logged in)
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, admin } = useAuth();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    const isIEEE = admin && (
      admin.email.toLowerCase().endsWith('@ieee.org') ||
      admin.email.toLowerCase().endsWith('@ieeepune.org')
    );
    return isIEEE ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/activities" element={<PublicLayout><ActivitiesPage /></PublicLayout>} />
      <Route path="/public-events" element={<PublicLayout><ActivitiesPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><PublicAbout /></PublicLayout>} />
      <Route path="/execom" element={<PublicLayout><PublicExeCom /></PublicLayout>} />
      <Route path="/team-members" element={<Navigate to="/execom" replace />} />
      <Route path="/public-events/:id" element={<PublicLayout><PublicEventDetail /></PublicLayout>} />

      <Route path="/public-blogs" element={<PublicLayout><PublicBlogs /></PublicLayout>} />
      <Route path="/public-blogs/:id" element={<PublicLayout><PublicBlogDetail /></PublicLayout>} />
      <Route path="/public-gallery" element={<PublicLayout><PublicGallery /></PublicLayout>} />
      <Route path="/grants-awards" element={<PublicLayout><PublicGrants /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><PublicContact /></PublicLayout>} />

      {/* Public Guest Routes */}
      <Route
        path="/admin-portal"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/admin-register-gate-secure"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TeamList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TeamForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TeamForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <GalleryManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AnnouncementList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscribers"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SubscriberList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ContactList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/grants"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <GrantList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />


      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
