import React from "react";
import { Badge } from "./ui/badge";
import { Tv } from "lucide-react";
import PropTypes from "prop-types";

const STREAMING_SERVICE_STYLES = {
  8: { name: "Netflix", bg: "bg-red-600", text: "text-white" },
  9: { name: "Prime", bg: "bg-blue-500", text: "text-white" },
  337: { name: "Disney+", bg: "bg-blue-700", text: "text-white" },
  384: { name: "HBO Max", bg: "bg-purple-700", text: "text-white" },
  1899: { name: "Max", bg: "bg-purple-600", text: "text-white" },
  15: { name: "Hulu", bg: "bg-green-500", text: "text-white" },
  350: { name: "Apple TV+", bg: "bg-gray-800", text: "text-white" },
  531: { name: "Paramount+", bg: "bg-blue-600", text: "text-white" },
  387: { name: "Peacock", bg: "bg-yellow-600", text: "text-white" },
};

const StreamingBadges = ({ providers, maxDisplay = 3, compact = false }) => {
  if (!providers || providers.length === 0) {
    return null;
  }

  const displayProviders = providers.slice(0, maxDisplay);
  const remainingCount = providers.length - maxDisplay;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Tv className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {providers.length} service{providers.length > 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayProviders.map((provider) => {
        const style = STREAMING_SERVICE_STYLES[provider.provider_id] || {
          name: provider.provider_name,
          bg: "bg-gray-600",
          text: "text-white",
        };

        return (
          <Badge
            key={provider.provider_id}
            className={`${style.bg} ${style.text} hover:${style.bg} border-0 text-xs px-2 py-0.5`}
            title={`Available on ${provider.provider_name}`}
          >
            {style.name}
          </Badge>
        );
      })}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className="text-xs px-2 py-0.5"
          title={`+${remainingCount} more service${remainingCount > 1 ? "s" : ""}`}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

StreamingBadges.propTypes = {
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      provider_id: PropTypes.number.isRequired,
      provider_name: PropTypes.string.isRequired,
    })
  ),
  maxDisplay: PropTypes.number,
  compact: PropTypes.bool,
};

export default StreamingBadges;

