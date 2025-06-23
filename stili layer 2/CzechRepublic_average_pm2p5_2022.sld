<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_average_pm2p5_2022</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="7.5217471992783" label="7,5217" color="#fff5eb"/>
              <sld:ColorMapEntry quantity="8.9354723685200383" label="8,9355" color="#fee7cf"/>
              <sld:ColorMapEntry quantity="10.563780822378826" label="10,5638" color="#fdd2a5"/>
              <sld:ColorMapEntry quantity="11.283265953153638" label="11,2833" color="#fdb271"/>
              <sld:ColorMapEntry quantity="11.876525622389011" label="11,8765" color="#fd9243"/>
              <sld:ColorMapEntry quantity="12.356182376238888" label="12,3562" color="#f3701b"/>
              <sld:ColorMapEntry quantity="12.88632931470454" label="12,8863" color="#df5005"/>
              <sld:ColorMapEntry quantity="13.555324260863575" label="13,5553" color="#b13a03"/>
              <sld:ColorMapEntry quantity="30.153972453300057" label="30,1540" color="#7f2704"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
