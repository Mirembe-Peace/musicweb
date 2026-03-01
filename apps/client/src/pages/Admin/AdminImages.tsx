import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArtistImage {
  id: string;
  url: string;
  type: 'ARTIST' | 'GALLERY';
  description: string;
}

export default function AdminImages() {
  const [images, setImages] = useState<ArtistImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<ArtistImage>>({ type: 'GALLERY' });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/images');
      setImages(res.data);
    } catch (error) {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentImage.id) {
        await api.patch(`/images/${currentImage.id}`, currentImage);
        toast.success("Image updated successfully");
      } else {
        await api.post('/images', currentImage);
        toast.success("Image uploaded successfully");
      }
      setIsEditing(false);
      setCurrentImage({ type: 'GALLERY' });
      fetchImages();
    } catch (error) {
      toast.error("Failed to save image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/images/${id}`);
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Images</h2>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentImage({ type: 'GALLERY' }); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{currentImage.id ? "Edit Image" : "Add New Image"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL</label>
                <Input
                  value={currentImage.url || ''}
                  onChange={e => setCurrentImage({ ...currentImage, url: e.target.value })}
                  placeholder="Image URL (e.g. S3 link)"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Type</label>
                <Select
                  value={currentImage.type}
                  onValueChange={(v) => setCurrentImage({ ...currentImage, type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARTIST">Artist</SelectItem>
                    <SelectItem value="GALLERY">Gallery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold">Description</label>
                <Input
                  value={currentImage.description || ''}
                  onChange={e => setCurrentImage({ ...currentImage, description: e.target.value })}
                  placeholder="Short description"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Image</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Images</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map(img => (
                  <TableRow key={img.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted">
                        {img.url ? <img src={img.url} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-2 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{img.description || "No description"}</TableCell>
                    <TableCell>{img.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setCurrentImage(img); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(img.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {images.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No images found. Add your first image!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
