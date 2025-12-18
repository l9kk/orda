import { Listing } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [showContact, setShowContact] = useState(false);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {listing.title}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {listing.category}
          </span>
        </div>
        {listing.location && (
          <p className="text-xs text-muted-foreground mt-1">
            📍 {listing.location}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {listing.description}
        </p>
        <p className="text-2xl font-bold text-foreground mb-4">
          {listing.price.toLocaleString()} KZT
        </p>
        
        {/* #PROXY: Displays contact info which is protected by the backend proxy */}
        {showContact ? (
          <div className="bg-muted/50 p-3 rounded-md text-sm border border-border">
            <p className="font-medium text-muted-foreground">Contact Info:</p>
            <p className="text-foreground">{listing.contact_info}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button 
          variant={showContact ? "outline" : "primary"} 
          className="w-full"
          onClick={() => setShowContact(!showContact)}
        >
          {showContact ? "Hide Contact" : "Contact Seller"}
        </Button>
      </CardFooter>
    </Card>
  );
}
