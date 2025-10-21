// src/pages/kawader/Kawader.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  KawaderList,
  KawaderDetails,
  KawaderForm,
  useKawader,
  useKawaderList,
  type KawaderItem,
  type CreateKawaderPayload,
  type UpdateKawaderPayload,
} from '../../features/kawader';

const KawaderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, action } = useParams<{ id?: string; action?: string }>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedItem, setSelectedItem] = useState<KawaderItem | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Hooks for data management
  const { item: currentItem, createItem, updateItem, deleteItem, loading: itemLoading } = useKawader(id);
  const { updateItem: updateListItem, removeItem: removeListItem, addItem: addListItem } = useKawaderList();

  // Handle view item
  const handleViewItem = (item: KawaderItem) => {
    navigate(`/kawader/${item._id}`);
  };

  // Handle create item
  const handleCreateItem = () => {
    navigate('/kawader/new');
  };

  // Handle edit item
  const handleEditItem = (item: KawaderItem) => {
    navigate(`/kawader/${item._id}/edit`);
  };

  // Handle delete item
  const handleDeleteItem = async (item: KawaderItem) => {
    if (window.confirm(`هل أنت متأكد من حذف عرض "${item.title}"؟`)) {
      try {
        await deleteItem();
        removeListItem(item._id);
        setSnackbar({
          open: true,
          message: 'تم حذف العرض الوظيفي بنجاح',
          severity: 'success',
        });
        navigate('/kawader');
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'فشل في حذف العرض الوظيفي',
          severity: 'error',
        });
      }
    }
  };

  // Handle form submit
  const handleFormSubmit = async (data: CreateKawaderPayload | UpdateKawaderPayload) => {
    try {
      if (dialogMode === 'create') {
        const newItem = await createItem(data as CreateKawaderPayload);
        addListItem(newItem);
        setSnackbar({
          open: true,
          message: 'تم إنشاء العرض الوظيفي بنجاح',
          severity: 'success',
        });
        navigate(`/kawader/${newItem._id}`);
      } else if (dialogMode === 'edit' && selectedItem) {
        const updatedItem = await updateItem(data as UpdateKawaderPayload);
        updateListItem(updatedItem);
        setSnackbar({
          open: true,
          message: 'تم تحديث العرض الوظيفي بنجاح',
          severity: 'success',
        });
        navigate(`/kawader/${updatedItem._id}`);
      }
      setDialogOpen(false);
      setDialogMode(null);
      setSelectedItem(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'فشل في حفظ العرض الوظيفي',
        severity: 'error',
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/kawader');
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedItem(null);
  };

  // Determine what to render based on route
  const renderContent = () => {
    // Show details page
    if (id && !action) {
      return (
        <KawaderDetails
          item={currentItem!}
          loading={itemLoading}
          onBack={handleBack}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      );
    }

    // Show form (create/edit)
    if ((id === 'new') || (id && action === 'edit')) {
      const isEdit = id !== 'new' && action === 'edit';
      return (
        <KawaderForm
          item={isEdit ? currentItem : undefined}
          loading={itemLoading}
          mode={isEdit ? 'edit' : 'create'}
          onSubmit={handleFormSubmit}
          onCancel={handleBack}
        />
      );
    }

    // Show list page (default)
    return (
      <KawaderList
        onViewItem={handleViewItem}
        onCreateItem={handleCreateItem}
      />
    );
  };

  return (
    <>
      {renderContent()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KawaderPage;
