import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function AdminMerch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/merchandise');
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch merchandise");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        await api.patch(`/merchandise/${currentProduct.id}`, currentProduct);
        toast.success("Product updated successfully");
      } else {
        await api.post('/merchandise', currentProduct);
        toast.success("Product added successfully");
      }
      setIsEditing(false);
      setCurrentProduct({});
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/merchandise/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Merchandise Management</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentProduct({}); }} className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {isEditing && (
        <Card className="rounded-3xl border shadow-soft">
          <CardHeader>
            <CardTitle>{currentProduct.id ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Product Name</label>
                <Input
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  placeholder="Item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Price (UGX)</label>
                <Input
                  type="number"
                  value={currentProduct.price || 0}
                  onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                  placeholder="Price"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL</label>
                <Input
                  value={currentProduct.imageUrl || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                  placeholder="Product image URL"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <Input
                  value={currentProduct.description || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  placeholder="Product description"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-2xl">Cancel</Button>
                <Button type="submit" className="rounded-2xl">Save Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl border shadow-soft">
        <CardHeader>
          <CardTitle>Existing Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(prod => (
                  <TableRow key={prod.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted">
                        {prod.imageUrl ? <img src={prod.imageUrl} alt="" className="h-full w-full object-cover" /> : <Package className="h-full w-full p-2 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{prod.name}</TableCell>
                    <TableCell>UGX {prod.price?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setCurrentProduct(prod); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(prod.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No merchandise found. Add your first item!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
