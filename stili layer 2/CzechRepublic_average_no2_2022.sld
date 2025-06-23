<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_average_no2_2022</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="4.1826457520111999" label="4,1826" color="#fff5eb"/>
              <sld:ColorMapEntry quantity="5.8764469531632049" label="5,8764" color="#fee7cf"/>
              <sld:ColorMapEntry quantity="6.4780703306215663" label="6,4781" color="#fdd2a5"/>
              <sld:ColorMapEntry quantity="7.0426707310055683" label="7,0427" color="#fdb271"/>
              <sld:ColorMapEntry quantity="7.6905728298068823" label="7,6906" color="#fd9243"/>
              <sld:ColorMapEntry quantity="8.3384749286081963" label="8,3385" color="#f3701b"/>
              <sld:ColorMapEntry quantity="9.1437246799755414" label="9,1437" color="#df5005"/>
              <sld:ColorMapEntry quantity="10.504319087458299" label="10,5043" color="#b13a03"/>
              <sld:ColorMapEntry quantity="20.778195225593411" label="20,7782" color="#7f2704"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
