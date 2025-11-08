import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tv } from "lucide-react";
import { POPULAR_STREAMING_SERVICES } from "../constants/movieFilters";

const MovieFilters = ({
  genres,
  filters,
  onChange,
  onReset,
  disabled,
  defaultFilters,
  hideYearFilter,
}) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const baselineYearRange = defaultFilters?.yearRange ?? [1980, currentYear];
  const baselineRating = defaultFilters?.rating ?? 0;

  const handleGenreToggle = (genreId) => {
    if (disabled) {
      return;
    }

    const isSelected = filters.genres.includes(genreId);
    const updatedGenres = isSelected
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];
    onChange({ ...filters, genres: updatedGenres });
  };

  const handleYearChange = (position, value) => {
    if (Number.isNaN(value)) {
      return;
    }

    const sanitizedValue = Math.min(
      Math.max(value, 1900),
      currentYear + 1
    );
    const nextRange = [...filters.yearRange];
    nextRange[position] = sanitizedValue;

    if (nextRange[0] > nextRange[1]) {
      nextRange.sort((a, b) => a - b);
    }

    onChange({ ...filters, yearRange: nextRange });
  };

  const handleRatingChange = (value) => {
    if (Number.isNaN(value)) {
      onChange({ ...filters, rating: baselineRating });
      return;
    }

    const clampedValue = Math.max(0, Math.min(10, value));
    onChange({ ...filters, rating: clampedValue });
  };

  const handleStreamingToggle = (serviceId) => {
    if (disabled) {
      return;
    }

    const isSelected = filters.streamingServices?.includes(serviceId) || false;
    const updatedServices = isSelected
      ? filters.streamingServices.filter((id) => id !== serviceId)
      : [...(filters.streamingServices || []), serviceId];
    onChange({ ...filters, streamingServices: updatedServices });
  };

  const hasActiveFilters = hideYearFilter
    ? filters.genres.length > 0 || 
      filters.rating > baselineRating || 
      (filters.streamingServices?.length > 0)
    : filters.genres.length > 0 ||
      filters.yearRange[0] !== baselineYearRange[0] ||
      filters.yearRange[1] !== baselineYearRange[1] ||
      filters.rating > baselineRating ||
      (filters.streamingServices?.length > 0);

  return (
    <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="text-xs text-muted-foreground">
            {hideYearFilter
              ? "Filter by genres and rating to refine results."
              : "Combine genres, release year, and rating to refine results."}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            Genres
          </Label>
          <div className="flex flex-wrap gap-2">
            {genres.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Genres unavailable right now.
              </p>
            ) : (
              genres.map((genre) => {
                const isActive = filters.genres.includes(genre.id);
                return (
                  <Button
                    key={genre.id}
                    variant={isActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleGenreToggle(genre.id)}
                    className="rounded-full px-4"
                    disabled={disabled}
                  >
                    {genre.name}
                  </Button>
                );
              })
            )}
          </div>
        </div>

        {!hideYearFilter ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="year-from">From year</Label>
              <Input
                id="year-from"
                type="number"
                min="1900"
                max={currentYear}
                value={filters.yearRange[0]}
                onChange={(event) =>
                  handleYearChange(0, Number.parseInt(event.target.value, 10))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year-to">To year</Label>
              <Input
                id="year-to"
                type="number"
                min="1900"
                max={currentYear + 1}
                value={filters.yearRange[1]}
                onChange={(event) =>
                  handleYearChange(1, Number.parseInt(event.target.value, 10))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Minimum rating</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={filters.rating}
                onChange={(event) =>
                  handleRatingChange(Number.parseFloat(event.target.value))
                }
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Only show movies rated {filters.rating} or higher.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="rating">Minimum rating</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={filters.rating}
              onChange={(event) =>
                handleRatingChange(Number.parseFloat(event.target.value))
              }
              disabled={disabled}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Only show movies rated {filters.rating} or higher.
            </p>
          </div>
        )}

        <div>
          <Label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Tv className="h-4 w-4" />
            Streaming Services
          </Label>
          <p className="mb-3 text-xs text-muted-foreground">
            Filter by availability on streaming platforms (US only)
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_STREAMING_SERVICES.map((service) => {
              const isActive = filters.streamingServices?.includes(service.id) || false;
              return (
                <Button
                  key={service.id}
                  variant={isActive ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleStreamingToggle(service.id)}
                  className="rounded-full px-4"
                  disabled={disabled}
                >
                  {service.shortName}
                </Button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {filters.genres.length > 0 && (
              <Badge variant="outline">
                Genres: {filters.genres.length} selected
              </Badge>
            )}
            {!hideYearFilter && (
              <Badge variant="outline">
                Years: {filters.yearRange[0]} - {filters.yearRange[1]}
              </Badge>
            )}
            {filters.rating > 0 && (
              <Badge variant="outline">
                Min rating: {filters.rating.toFixed(1)}
              </Badge>
            )}
            {filters.streamingServices?.length > 0 && (
              <Badge variant="outline">
                Streaming: {filters.streamingServices.length} selected
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MovieFilters.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  filters: PropTypes.shape({
    genres: PropTypes.arrayOf(PropTypes.number),
    yearRange: PropTypes.arrayOf(PropTypes.number),
    rating: PropTypes.number,
    streamingServices: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  defaultFilters: PropTypes.shape({
    genres: PropTypes.arrayOf(PropTypes.number),
    yearRange: PropTypes.arrayOf(PropTypes.number),
    rating: PropTypes.number,
    streamingServices: PropTypes.arrayOf(PropTypes.number),
  }),
  hideYearFilter: PropTypes.bool,
};

MovieFilters.defaultProps = {
  genres: [],
  disabled: false,
  defaultFilters: undefined,
  hideYearFilter: false,
};

export default MovieFilters;

