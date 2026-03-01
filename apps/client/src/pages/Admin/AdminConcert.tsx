import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Calendar, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";
import { api } from '@/lib/api';
import { Switch } from "@/components/ui/switch";

interface Concert {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  price: number;
  imageUrl?: string;
  isEnabled: boolean;
}

export default function AdminConcert() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConcert, setCurrentConcert] = useState<Partial<Concert>>({ isEnabled: false });

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/concerts');
      setConcerts(res.data);
    } catch (error) {
      toast.error("Failed to fetch concerts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentConcert.id) {
        await api.patch(`/concerts/${currentConcert.id}`, currentConcert);
        toast.success("Concert updated successfully");
      } else {
        await api.post('/concerts', currentConcert);
        toast.success("Concert created successfully");
      }
      setIsEditing(false);
      setCurrentConcert({ isEnabled: false });
      fetchConcerts();
    } catch (error) {
      toast.error("Failed to save concert");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this concert?")) return;
    try {
      await api.delete(`/concerts/${id}`);
      toast.success("Concert deleted successfully");
      fetchConcerts();
    } catch (error) {
      toast.error("Failed to delete concert");
    }
  };

  const toggleStatus = async (concert: Concert) => {
    try {
      await api.patch(`/concerts/${concert.id}`, { isEnabled: !concert.isEnabled });
      toast.success(`Concert ${!concert.isEnabled ? 'enabled' : 'disabled'}`);
      fetchConcerts();
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Concert Management</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentConcert({ isEnabled: false }); }} className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" /> Add Concert
        </Button>
      </div>

      {isEditing && (
        <Card className="rounded-3xl border shadow-soft">
          <CardHeader>
            <CardTitle>{currentConcert.id ? "Edit Concert" : "Add New Concert"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Concert Title</label>
                <Input
                  value={currentConcert.title || ''}
                  onChange={e => setCurrentConcert({ ...currentConcert, title: e.target.value })}
                  placeholder="e.g. Ashaba Live in Kampala"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Date & Time</label>
                <Input
                  value={currentConcert.dateTime || ''}
                  onChange={e => setCurrentConcert({ ...currentConcert, dateTime: e.target.value })}
                  placeholder="e.g. Dec 24, 2026 at 8:00 PM"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Location</label>
                <Input
                  value={currentConcert.location || ''}
                  onChange={e => setCurrentConcert({ ...currentConcert, location: e.target.value })}
                  placeholder="e.g. Serena Hotel"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Ticket Price (UGX)</label>
                <Input
                  type="number"
                  value={currentConcert.price || 0}
                  onChange={e => setCurrentConcert({ ...currentConcert, price: Number(e.target.value) })}
                  placeholder="Price"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL</label>
                <Input
                  value={currentConcert.imageUrl || ''}
                  onChange={e => setCurrentConcert({ ...currentConcert, imageUrl: e.target.value })}
                  placeholder="Banner image URL"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="enabled-status" 
                  checked={currentConcert.isEnabled}
                  onCheckedChange={(checked: boolean) => setCurrentConcert({ ...currentConcert, isEnabled: checked })}
                />
                <label htmlFor="enabled-status" className="text-sm font-bold">Enable Popup</label>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-2xl">Cancel</Button>
                <Button type="submit" className="rounded-2xl">Save Concert</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl border shadow-soft">
        <CardHeader>
          <CardTitle>Upcoming Concerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Concert</TableHead>
                  <TableHead>Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {concerts.map(concert => (
                  <TableRow key={concert.id}>
                    <TableCell>
                      <Switch 
                        checked={concert.isEnabled}
                        onCheckedChange={() => toggleStatus(concert)}
                      />
                    </TableCell>
                    <TableCell className="font-bold">{concert.title}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {concert.dateTime}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {concert.location}</div>
                        <div className="flex items-center gap-1 font-bold text-primary"><Ticket className="h-3 w-3" /> UGX {concert.price.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setCurrentConcert(concert); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(concert.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {concerts.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No concerts found. Create your first event!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
