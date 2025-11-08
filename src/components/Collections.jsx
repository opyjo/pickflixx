import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import MovieCard from "./MovieCard";

const Collections = () => {
  const { collections, createCollection, deleteCollection, updateCollection } =
    useContext(GlobalContext);
  
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionColor, setNewCollectionColor] = useState("#3b82f6");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState(null);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      return;
    }

    createCollection(newCollectionName.trim(), newCollectionColor);
    setNewCollectionName("");
    setNewCollectionColor("#3b82f6");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteCollection = (collectionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this collection? This action cannot be undone."
      )
    ) {
      deleteCollection(collectionId);
      if (expandedCollection === collectionId) {
        setExpandedCollection(null);
      }
    }
  };

  const colorOptions = [
    { value: "#3b82f6", name: "Blue" },
    { value: "#8b5cf6", name: "Purple" },
    { value: "#ec4899", name: "Pink" },
    { value: "#10b981", name: "Green" },
    { value: "#f59e0b", name: "Orange" },
    { value: "#ef4444", name: "Red" },
    { value: "#06b6d4", name: "Cyan" },
    { value: "#6366f1", name: "Indigo" },
  ];

  const collectionsArray = Object.entries(collections || {}).map(
    ([id, collection]) => ({
      id,
      ...collection,
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">My Collections</h1>
          <p className="text-muted-foreground">
            Organize your movies into custom collections
          </p>
        </div>

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <i className="fas fa-plus mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Give your collection a name and choose a color
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  placeholder="e.g., Date Night Movies"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateCollection();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCollectionColor(color.value)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        newCollectionColor === color.value
                          ? "scale-110 border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {collectionsArray.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <i className="fas fa-folder-open text-2xl text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Collections Yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create custom collections to organize your movies by theme, mood,
              or any category you like!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <i className="fas fa-plus mr-2" />
              Create Your First Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collectionsArray.map((collection) => (
            <Card key={collection.id} className="overflow-hidden">
              <CardHeader
                className="pb-3"
                style={{
                  borderLeft: `4px solid ${collection.color || "#3b82f6"}`,
                }}
              >
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{collection.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="h-8 w-8 p-0"
                    aria-label="Delete collection"
                  >
                    <i className="fas fa-trash text-sm" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <i className="fas fa-film" />
                  <span>{collection.movies?.length || 0} movies</span>
                </div>
              </CardHeader>
              <CardContent>
                {collection.movies && collection.movies.length > 0 ? (
                  <>
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      {collection.movies.slice(0, 3).map((movie) => (
                        <div
                          key={movie.id}
                          className="aspect-[2/3] overflow-hidden rounded"
                        >
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                              alt={movie.title || movie.original_title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-secondary">
                              <i className="fas fa-film text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        setExpandedCollection(
                          expandedCollection === collection.id
                            ? null
                            : collection.id
                        )
                      }
                    >
                      {expandedCollection === collection.id
                        ? "Hide Movies"
                        : "View All"}
                    </Button>

                    {expandedCollection === collection.id && (
                      <div className="mt-4 grid gap-4">
                        {collection.movies.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} type="collection" />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No movies in this collection yet
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;

