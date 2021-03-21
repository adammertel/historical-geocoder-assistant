# Historical Geocoding Assistant

<img src="./imgs/logo.png" alt="Historical Geocoding Assistant Logo" height="150" />

## Description

The “Historical Geocoding Assistant” is an open-sourced browser-based application for assigning geographic coordinates in a more convenient and faster way than copy-pasting them from services such as Google Maps. The application was designed with historical projects in mind but is suitable for any geocoding work

## Citation

To cite the software:
`Adam Mertel, David Zbíral, Zdeněk Stachoň, and Hana Hořínková, ‘Historical Geocoding Assistant’, SoftwareX 14 (2021): 100682, https://doi.org/10.1016/j.softx.2021.100682.`

## Essential Features

- works online with a live Google Spreadsheets table;
- gathers suggestions of coordinates from gazetteers for instant use (GeoNames, Wikipedia, Getty Thesaurus of Geographic Names, Pleiades, and China Historical GIS);
- integrates search services (Google Maps, Google Search, Peripleo);
- supports multiple base layers (OpenStreetMap, satellite images, Imperium, etc.);
- supports multiple overlay layers;
- allows setting relevant spatial extent;
- allows spatial uncertainty levels.
- …

## Future Development

- integration of additional gazetteers and other relevant services (World-Historical Gazetteer)
- possibility to load a custom map service directly from the GUI
- further improvement of the algorithm to rank and sort geocode suggestions
- management of the custom parametrization of gazetteer calls
- integration of line and polygon topologies
- user management

## Testing version

Try it [here](http://dissinet.cz/apps/hga)

## Manual

[manual](https://github.com/adammertel/historical-geocoder-assistant/tree/master/manual)

## Screenshot

![alt text](./imgs/layout.png "Historical Geocoding Assistant Screen")
