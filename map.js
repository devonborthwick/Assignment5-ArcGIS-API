var Main;

require([
  "esri/Map",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/ElevationLayer",
  "esri/views/SceneView",
  "esri/widgets/Search",
  "esri/geometry/Point"
], function(
  Map, Graphic, GraphicsLayer, ElevationLayer, SceneView, Search, Point
) {
  $(document).ready(function() {
    Main = (function() {
      let layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      });

      let map = new Map({
        basemap: "topo-vector",
        ground: {
          layers: [layer]
        }
      });

      let view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,
        camera: {
          position: {
            x: -105.58077771278067,
            y: 41.31403134536375,
            z: 2000000,
            spatialReference: {
              wkid: 4326
            }
          },
          heading: 0,
          tilt: 10
        },
        popup: {
          dockEnabled: true,
          dockOptions: {
            breakpoint: false
          }
        },
        environment: {
          lighting: {
            type: "sun"
          },
          atmosphereEnabled: true
        }
      });

      const initMap = function() {


        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
        for (const [key, value] of Object.entries(myStuff)) {
          console.log("Processing point:", key, value.coord);
          const point = {
            type: "point",
            x: value.coord[0],
            y: value.coord[1],
            z: 10000
          };

          const markerSymbol = {
            type: "simple-marker",
            style: "diamond",
            color: [34, 139, 34],
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          };

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            popupTemplate: {
              title: key + ": " + value.placename + ", " + value.date,
              content: "These are some of the places I love to go on vacation."
            }
          });

          graphicsLayer.add(pointGraphic);
           
        }

        graphicsLayer.featureReduction = {
          type: "selection",
          selectionRadius: 100,
          labelingInfo: [
            {
              deconflictionStrategy: "none",
              labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
              },
              symbol: {
                type: "text",
                color: "white",
                font: {
                  family: "Noto Sans",
                  size: "12px"
                }
              },
              labelPlacement: "center-center"
            }
          ],
          popupTemplate: {
            title: "Cluster Summary",
            content: "This cluster represents <b>{cluster_count}</b> features.",
            fieldInfos: [
              {
                fieldName: "cluster _count",
              format: {
                places: 0,
                digitSeparator: true
                    }
                }]
                }};
                
                   
                   view.on("click", function(event) {
                    view.hitTest(event).then(function(response) {
                      if (response.results.length) {
                        const graphic = response.results.filter(result => result.graphic.geometry.type === "point")[0].graphic;
                        if (graphic) {
                          view.goTo({
                            target: graphic.geometry, 
                            zoom: 15 
                          })
                        }
                      }
                    })
                  })
              
                  const source = [{
                    layer: graphicsLayer,
                    name: "Vacation Spots"
                    
              
                   }];
                    const searchWidget = new Search({
                        view: view,
                        sources: myStuff,
                        placeholder: "Places",
                        searchFields: ["placename", "city", "country"],
                        displayField: "placename",
                        outFields: ["placename", "city", "country"],
                        exactMatch: false,
                        zoomScale: 900,
                        suggestionsEnabled: true,
                        minSuggestCharacters: 0
                        
                      });
                      view.ui.add(searchWidget, {
                        position: "top-right"
                      });
                   
                    
                    };
                  
                    
                
                initMap()
                return {
    
                

            };
            })()
            })
            });

    