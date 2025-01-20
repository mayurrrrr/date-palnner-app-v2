import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface DateDetails {
  receiverName: string;
  date: Date;
  cuisine: string;
  dessert: string;
  additionalPlaces: string;
  selectedPlace: google.maps.places.PlaceResult;
}

export function generateDatePDF(details: DateDetails): string {
  const doc = new jsPDF();
  
  // Set up fonts and colors
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(219, 39, 119); // pink-600
  
  // Title
  doc.text("Our Special Date Plan", 105, 20, { align: "center" });
  
  // Reset font for content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Content
  let y = 40;
  const leftMargin = 20;
  
  // Add details with some styling
  doc.setFont("helvetica", "bold");
  doc.text("Dear " + details.receiverName + ",", leftMargin, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text("Here's the plan for our special date together:", leftMargin, y);
  y += 10;
  
  // Date and Time
  doc.setFont("helvetica", "bold");
  doc.text("When:", leftMargin, y);
  doc.setFont("helvetica", "normal");
  doc.text(format(details.date, "EEEE, MMMM do, yyyy 'at' h:mm aaa"), leftMargin + 30, y);
  y += 10;
  
  // Location
  doc.setFont("helvetica", "bold");
  doc.text("Where:", leftMargin, y);
  doc.setFont("helvetica", "normal");
  doc.text(details.selectedPlace.name || "Our Special Place", leftMargin + 30, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(details.selectedPlace.formatted_address || "", leftMargin + 30, y);
  doc.setFontSize(12);
  y += 10;
  
  // Add Google Maps link
  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${details.selectedPlace.place_id}`;
  doc.setTextColor(0, 0, 255);
  doc.text("View on Google Maps", leftMargin + 30, y);
  doc.link(leftMargin + 30, y - 5, 100, 6, { url: mapsUrl });
  doc.setTextColor(0, 0, 0);
  y += 15;
  
  // Food Details
  doc.setFont("helvetica", "bold");
  doc.text("Food:", leftMargin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`We'll enjoy ${details.cuisine} cuisine`, leftMargin + 30, y);
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Dessert:", leftMargin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Followed by delicious ${details.dessert}`, leftMargin + 30, y);
  y += 15;
  
  // Additional Places
  if (details.additionalPlaces) {
    doc.setFont("helvetica", "bold");
    doc.text("Other Places to Visit:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    const additionalPlacesArray = doc.splitTextToSize(details.additionalPlaces, 150);
    doc.text(additionalPlacesArray, leftMargin + 60, y);
    y += 15 * (additionalPlacesArray.length + 2);
  }
  
  // Add a sweet message at the bottom
  y = Math.max(y + 20, 200);
  doc.setTextColor(219, 39, 119);
  doc.setFont("helvetica", "italic");
  doc.text("Can't wait to share these special moments with you! <3", leftMargin, y);
  
  // Return the PDF as a data URL
  return doc.output('dataurlstring');
}