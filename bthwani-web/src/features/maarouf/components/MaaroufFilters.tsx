// src/features/maarouf/components/MaaroufFilters.tsx
import React from 'react';
import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Category as KindIcon,
} from '@mui/icons-material';
import { MaaroufFilters, MaaroufKind, MaaroufStatus, MaaroufKindLabels, MaaroufStatusLabels } from '../types';

interface MaaroufFiltersProps {
  filters: MaaroufFilters;
  onFiltersChange: (filters: MaaroufFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

const MaaroufFiltersComponent: React.FC<MaaroufFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleKindChange = (kind: MaaroufKind | '') => {
    onFiltersChange({
      ...filters,
      kind: kind === '' ? undefined : kind
    });
  };

  const handleStatusChange = (status: MaaroufStatus | '') => {
    onFiltersChange({
      ...filters,
      status: status === '' ? undefined : status
    });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onFiltersChange({
      ...filters,
      tags: tags.length > 0 ? tags : undefined
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.kind) count++;
    if (filters.status) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>فلترة الإعلانات</span>
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} نشط`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="البحث في العناوين والأوصاف..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
          size="small"
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>النوع</InputLabel>
          <Select
            value={filters.kind || ''}
            label="النوع"
            onChange={(e) => handleKindChange(e.target.value as MaaroufKind | '')}
          >
            <MenuItem value="">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <KindIcon sx={{ mr: 1, opacity: 0.5 }} />
                الكل
              </Box>
            </MenuItem>
            {Object.values(MaaroufKind).map((kind) => (
              <MenuItem key={kind} value={kind}>
                {MaaroufKindLabels[kind]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>الحالة</InputLabel>
          <Select
            value={filters.status || ''}
            label="الحالة"
            onChange={(e) => handleStatusChange(e.target.value as MaaroufStatus | '')}
          >
            <MenuItem value="">الكل</MenuItem>
            {Object.values(MaaroufStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {MaaroufStatusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="العلامات (مفصولة بفواصل)"
          value={filters.tags ? filters.tags.join(', ') : ''}
          onChange={(e) => handleTagsChange(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        />

        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<ClearIcon />}
          disabled={loading}
        >
          إعادة تعيين
        </Button>
      </Box>
    </Paper>
  );
};

export default MaaroufFiltersComponent;
