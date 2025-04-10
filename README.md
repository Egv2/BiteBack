BiteBack - Location Based Survival Coordination Game

BiteBack is a lightweight, mobile-friendly, web-based survival game that simulates coordination mechanisms in crisis scenarios. It enables users to collaborate and survive together in a zombie outbreak scenario.

Features
	•	Map Interaction: Mark zombie sightings, survivor camps, and movements on an OpenStreetMap-based interactive map
	•	City-Based Communication: Communicate with other survivors in city-specific chat rooms
	•	Emergency System: Send SOS messages and resource requests
	•	Voting Mechanism: Vote to verify safe camps
	•	Experience System: Earn EXP by marking locations, voting, and helping others
	•	Inventory System: Track resources like first aid kits, serum, painkillers, and food
	•	Mobile Compatibility: Fully responsive design for seamless use on all devices

Tech Stack
	•	Frontend: Next.js, React, TypeScript
	•	Map: Leaflet.js, OpenStreetMap
	•	Styling: Tailwind CSS
	•	Icons: Font Awesome

Getting Started

To run this project locally:

# Install dependencies
npm install

# Start development server
npm run dev

Open http://localhost:3000 in your browser to view the app.

Usage
	1.	Click on the map to mark zombie sightings, camps, and survivor movements
	2.	Communicate with other players via city-based chat rooms
	3.	Send SOS messages in emergency situations
	4.	Request supplies and track your inventory
	5.	Vote to verify camps and use the “Safe Camps Only” view for navigation

Contributing

This project is open source and contributions are welcome. Please open an issue to discuss your changes before submitting a pull request.

License

This project is licensed under the MIT License.

Multilingual Support

BiteBack supports multiple languages. Currently available languages:
	•	English
	•	Turkish

Adding a New Language

To add a new language:
	1.	Add a new language file under src/app/i18n/locales/
	2.	Update src/app/i18n/index.ts
	3.	Update the src/app/components/ui/LanguageSwitcher.tsx component

Please submit a pull request to contribute translations. New language contributions are highly appreciated.
