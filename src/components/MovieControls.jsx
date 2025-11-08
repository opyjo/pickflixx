import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Button } from "./ui/button";
import { Trash2, Check, Clock, FolderPlus } from "lucide-react";
import MovieNotesDialog from "./MovieNotesDialog";
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

const MovieControls = ({ movie, type }) => {
  const {
    removeMovieFromWatchList,
    addMovieToWatched,
    moveToWatchList,
    removeFromWatched,
    setMovieNote,
    clearMovieNote,
    watchListNotes,
    collections,
    addMovieToCollection,
    removeMovieFromCollection,
  } = useContext(GlobalContext);

  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const existingNote = watchListNotes?.[movie.id];

  const handleAddToWatched = () => {
    addMovieToWatched(movie);
  };

  const handleRemoveFromWatchList = () => {
    removeMovieFromWatchList(movie.id);
  };

  const handleMoveToWatchList = () => {
    moveToWatchList(movie);
  };

  const handleRemoveFromWatched = () => {
    removeFromWatched(movie.id);
  };

  const handleSaveNote = (payload) => {
    setMovieNote(movie.id, payload);
  };

  const handleClearNote = () => {
    clearMovieNote(movie.id);
  };

  const handleToggleCollection = (collectionId, isInCollection) => {
    if (isInCollection) {
      removeMovieFromCollection(collectionId, movie.id);
    } else {
      addMovieToCollection(collectionId, movie);
    }
  };

  const collectionsArray = Object.entries(collections || {}).map(
    ([id, collection]) => ({
      id,
      ...collection,
    })
  );

  const getMovieCollections = () => {
    return collectionsArray.filter((collection) =>
      collection.movies?.some((m) => m.id === movie.id)
    );
  };

  const movieCollections = getMovieCollections();

  return (
    <div className="flex w-full flex-col gap-2">
      <MovieNotesDialog
        movie={{
          id: movie.id,
          title: movie.title ?? movie.original_title ?? "Selected movie",
          original_title: movie.original_title,
        }}
        existingNote={existingNote}
        onSave={handleSaveNote}
        onClear={handleClearNote}
        triggerVariant={existingNote ? "secondary" : "outline"}
      />

      <Dialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add to Collection
            {movieCollections.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {movieCollections.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Select collections for{" "}
              <strong>{movie.title || movie.original_title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {collectionsArray.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No collections yet. Create one from the Collections page!
              </p>
            ) : (
              <div className="space-y-2">
                {collectionsArray.map((collection) => {
                  const isInCollection = collection.movies?.some(
                    (m) => m.id === movie.id
                  );
                  return (
                    <button
                      key={collection.id}
                      onClick={() =>
                        handleToggleCollection(collection.id, isInCollection)
                      }
                      className={`flex w-full items-center justify-between rounded-lg border-2 p-3 transition-all hover:bg-accent ${
                        isInCollection
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: collection.color || "#3b82f6",
                          }}
                        />
                        <span className="font-medium">{collection.name}</span>
                      </div>
                      {isInCollection && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2 w-full">
        {type === "watchList" && (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToWatched}
              size="sm"
            >
              <Check className="h-4 w-4" />
              Watched
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleRemoveFromWatchList}
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </>
        )}

        {type === "watched" && (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleMoveToWatchList}
              size="sm"
            >
              <Clock className="h-4 w-4" />
              Watchlist
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleRemoveFromWatched}
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </>
        )}

        {type === "collection" && (
          <p className="text-xs text-center text-muted-foreground">
            View collection details to manage
          </p>
        )}

        {type === "discover" && (
          <p className="text-xs text-center text-muted-foreground">
            Use controls above to add to your lists
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieControls;
