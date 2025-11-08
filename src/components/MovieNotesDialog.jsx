import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

const MovieNotesDialog = ({
  movie,
  existingNote,
  onSave,
  onClear,
  triggerVariant,
}) => {
  const [open, setOpen] = useState(false);
  const [noteValue, setNoteValue] = useState(existingNote?.note ?? "");
  const [ratingValue, setRatingValue] = useState(
    existingNote?.rating ?? ""
  );

  useEffect(() => {
    if (open) {
      setNoteValue(existingNote?.note ?? "");
      setRatingValue(
        Number.isFinite(existingNote?.rating) ? existingNote.rating : ""
      );
    }
  }, [open, existingNote?.note, existingNote?.rating]);

  const hasChanges = useMemo(() => {
    const trimmedNote = noteValue.trim();
    const normalizedExistingNote = (existingNote?.note ?? "").trim();
    const parsedRating =
      ratingValue === "" ? null : Number.parseFloat(ratingValue);
    const normalizedExistingRating = Number.isFinite(existingNote?.rating)
      ? existingNote.rating
      : null;

    return (
      trimmedNote !== normalizedExistingNote ||
      parsedRating !== normalizedExistingRating
    );
  }, [noteValue, ratingValue, existingNote?.note, existingNote?.rating]);

  const handleSave = () => {
    const trimmedNote = noteValue.trim();
    const parsedRating =
      ratingValue === "" ? null : Number.parseFloat(ratingValue);

    onSave({
      note: trimmedNote,
      rating:
        Number.isFinite(parsedRating) && parsedRating >= 0 && parsedRating <= 5
          ? parsedRating
          : null,
    });
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setNoteValue(existingNote?.note ?? "");
      setRatingValue(
        Number.isFinite(existingNote?.rating) ? existingNote.rating : ""
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size="sm"
          className="w-full"
          aria-label="Add personal note"
        >
          {existingNote?.note ? "Edit note" : "Add note"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add personal note</DialogTitle>
          <DialogDescription>
            Capture quick thoughts or a rating for <strong>{movie.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="movie-note">Note</Label>
            <Textarea
              id="movie-note"
              value={noteValue}
              onChange={(event) => setNoteValue(event.target.value)}
              placeholder="What makes this movie special for you?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movie-rating">
              Rating <span className="text-xs text-muted-foreground">(0 - 5)</span>
            </Label>
            <Input
              id="movie-rating"
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={ratingValue}
              onChange={(event) => setRatingValue(event.target.value)}
            />
          </div>

          {existingNote?.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              {new Date(existingNote.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          {existingNote && (
            <Button variant="destructive" onClick={handleClear}>
              Remove note
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!hasChanges}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

MovieNotesDialog.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    original_title: PropTypes.string,
  }).isRequired,
  existingNote: PropTypes.shape({
    note: PropTypes.string,
    rating: PropTypes.number,
    updatedAt: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  triggerVariant: PropTypes.string,
};

MovieNotesDialog.defaultProps = {
  existingNote: undefined,
  triggerVariant: "outline",
};

export default MovieNotesDialog;

