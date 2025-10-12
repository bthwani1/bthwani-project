import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Switch, TextField, Typography } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { listPages, upsertPage, deletePage, type CmsPage } from "../../api/cmsApi";

export default function CmsPagesPage() {
  const [rows, setRows] = useState<CmsPage[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CmsPage>({ slug: "", title: {}, content: {}, isPublic: true });

  async function load() { setRows(await listPages()); }
  useEffect(() => { load(); }, []);

  function newItem() { setDraft({ slug: "", title: {}, content: {}, isPublic: true }); setOpen(true); }
  function editItem(v: CmsPage) { setDraft({ ...v }); setOpen(true); }
  async function save() { await upsertPage(draft); setOpen(false); await load(); }
  async function remove(id?: string) { if (!id || !confirm("تأكيد الحذف؟")) return; await deletePage(id); await load(); }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Pages</Typography>
        <Button startIcon={<Add/>} variant="contained" onClick={newItem}>إضافة</Button>
      </Stack>

      <Grid container spacing={2}>
        {rows.map((r) => (
          <Grid  size={{xs: 12, md: 6, lg: 4}} key={r._id || r.slug}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={700}>{r.slug}</Typography>
                    <Typography variant="body2">{r.title?.ar || r.title?.en}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.isPublic ? "Public ✅" : "Private ⛔"}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => editItem(r)}><Edit/></IconButton>
                    <IconButton color="error" onClick={() => remove(r._id)}><Delete/></IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{draft._id ? "تحرير صفحة" : "إضافة صفحة"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid  size={{xs: 12, md: 6}}><TextField label="Slug" fullWidth value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })}/></Grid>
            <Grid  size={{xs: 12, md: 6}}>
              <Stack direction="row" alignItems="center" height="100%"><Typography>Public</Typography><Switch checked={!!draft.isPublic} onChange={(e) => setDraft({ ...draft, isPublic: e.target.checked })}/></Stack>
            </Grid>
            <Grid  size={{xs: 12, md: 6}}><TextField label="Title (ar)" fullWidth value={draft.title?.ar || ""} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, ar: e.target.value } })}/></Grid>
            <Grid  size={{xs: 12, md: 6}}><TextField label="Title (en)" fullWidth value={draft.title?.en || ""} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, en: e.target.value } })}/></Grid>
            <Grid  size={{xs: 12, md: 6}}><TextField label="Content (ar)" fullWidth multiline minRows={6} value={draft.content?.ar || ""} onChange={(e) => setDraft({ ...draft, content: { ...draft.content, ar: e.target.value } })}/></Grid>
            <Grid  size={{xs: 12, md: 6}}><TextField label="Content (en)" fullWidth multiline minRows={6} value={draft.content?.en || ""} onChange={(e) => setDraft({ ...draft, content: { ...draft.content, en: e.target.value } })}/></Grid>
            <Grid  size={{xs: 12}}>
              <Stack direction="row" justifyContent="end" gap={1} mb={2}>
                <Button onClick={() => setOpen(false)}>إلغاء</Button>
                <Button variant="contained" onClick={save}>{draft._id ? "حفظ" : "إنشاء"}</Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
