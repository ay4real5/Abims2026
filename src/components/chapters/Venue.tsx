"use client";

import { motion } from "framer-motion";
import { MapPin, Car, Hotel, CloudSun, Navigation } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { wedding, images } from "@/lib/config";

function mapsEmbed(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function uberLink(query: string) {
  return `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodeURIComponent(query)}`;
}

function VenueCard({
  label,
  name,
  address,
  time,
  query,
  delay,
}: {
  label: string;
  name: string;
  address: string;
  time: string;
  query: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="card-glass rounded-3xl overflow-hidden"
    >
      <div className="aspect-video w-full bg-ink-2">
        <iframe
          title={name}
          src={mapsEmbed(query)}
          loading="lazy"
          className="w-full h-full grayscale-[0.3] contrast-110"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="p-6">
        <p className="uppercase tracking-[0.3em] text-gold text-xs">{label}</p>
        <h3 className="font-display text-2xl md:text-3xl text-ivory mt-2">
          {name}
        </h3>
        <p className="text-ivory/60 text-sm mt-1 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold" /> {address}
        </p>
        <p className="text-ivory/60 text-sm mt-1">Begins at {time}</p>

        <div className="flex flex-wrap gap-3 mt-5">
          <a
            href={mapsLink(query)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 text-gold text-sm hover:bg-gold/25 transition"
          >
            <Navigation className="h-4 w-4" /> Directions
          </a>
          <a
            href={uberLink(query)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 text-ivory/80 text-sm hover:border-gold transition"
          >
            <Car className="h-4 w-4 text-gold" /> Uber
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Venue() {
  const extras = [
    { icon: Car, title: "Parking", text: "Free parking available at both venues." },
    { icon: Hotel, title: "Hotels", text: "Recommended stays within 10 minutes." },
    { icon: CloudSun, title: "Weather", text: "Forecast appears closer to the day." },
  ];

  return (
    <ImmersiveSection id="venue" image={images.venue}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          chapter="Chapter Three"
          title="The Venue"
          subtitle="Two beautiful settings for one unforgettable day. Here's everything you need to arrive with ease."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <VenueCard
            label="The Ceremony"
            name={wedding.ceremony.name}
            address={wedding.ceremony.address}
            time={wedding.ceremony.time}
            query={wedding.ceremony.mapsQuery}
            delay={0}
          />
          <VenueCard
            label="The Reception"
            name={wedding.reception.name}
            address={wedding.reception.address}
            time={wedding.reception.time}
            query={wedding.reception.mapsQuery}
            delay={0.15}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {extras.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-glass rounded-2xl p-6 text-center"
            >
              <e.icon className="h-7 w-7 text-gold mx-auto" />
              <h4 className="text-ivory mt-3">{e.title}</h4>
              <p className="text-ivory/55 text-sm mt-1">{e.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ImmersiveSection>
  );
}
