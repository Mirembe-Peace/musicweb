import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { api } from '@/lib/api';
import { useAudio } from '@/app/AudioContext';

interface Song {
  id: string;
  title: string;
  audioUrl: string;
  coverImageUrl: string;
  price: number;
}

export default function AdminMusic() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSong, setCurrentSong] = useState<Partial<Song>>({});
  const { currentSongId, isPlaying, isLoading: isAudioLoading, toggle } = useAudio();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/music/admin/all');
      setSongs(res.data);
    } catch (error) {
      toast.error("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentSong.id) {
        await api.patch(`/music/${currentSong.id}`, currentSong);
        toast.success("Song updated successfully");
      } else {
        await api.post('/music', currentSong);
        toast.success("Song created successfully");
      }
      setIsEditing(false);
      setCurrentSong({});
      fetchSongs();
    } catch (error) {
      toast.error("Failed to save song");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;
    try {
      await api.delete(`/music/${id}`);
      toast.success("Song deleted successfully");
      fetchSongs();
    } catch (error) {
      toast.error("Failed to delete song");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Music Management</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentSong({}); }} className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" /> Add Song
        </Button>
      </div>

      {isEditing && (
        <Card className="rounded-3xl border shadow-soft">
          <CardHeader>
            <CardTitle>{currentSong.id ? "Edit Song" : "Add New Song"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Title</label>
                <Input
                  value={currentSong.title || ''}
                  onChange={e => setCurrentSong({ ...currentSong, title: e.target.value })}
                  placeholder="Song Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Audio URL</label>
                <Input
                  value={currentSong.audioUrl || ''}
                  onChange={e => setCurrentSong({ ...currentSong, audioUrl: e.target.value })}
                  placeholder="Audio URL (e.g. S3 link)"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Cover Image URL</label>
                <Input
                  value={currentSong.coverImageUrl || ''}
                  onChange={e => setCurrentSong({ ...currentSong, coverImageUrl: e.target.value })}
                  placeholder="Cover Image URL"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Price (UGX)</label>
                <Input
                  type="number"
                  value={currentSong.price || 0}
                  onChange={e => setCurrentSong({ ...currentSong, price: Number(e.target.value) })}
                  placeholder="Price"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-2xl">Cancel</Button>
                <Button type="submit" className="rounded-2xl">Save Song</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl border shadow-soft">
        <CardHeader>
          <CardTitle>Existing Songs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map(song => (
                  <TableRow key={song.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggle(song.id, song.audioUrl)}
                      >
                        {currentSongId === song.id && isAudioLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : currentSongId === song.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-bold">{song.title}</TableCell>
                    <TableCell>UGX {song.price?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setCurrentSong(song); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(song.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {songs.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No songs found. Add your first song!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}