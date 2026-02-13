"use client";

export default function MapEmbed() {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-2xl">
      <iframe
        title="AMCOLLOR Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12957.935674859855!2d51.38547901101624!3d35.71431551735028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e013deebbeafb%3A0x41437ade421ae34c!2sTehran%20Province%2C%20Tehran%2C%20District%206%2C%20Ranjbar%20St%2C%20Iran!5e0!3m2!1sen!2s!4v1767125720093!5m2!1sen!2s"
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
