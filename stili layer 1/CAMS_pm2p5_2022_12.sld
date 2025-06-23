<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_CAMS_pm2p5_2022_12</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="7.5217471992782565" label="7,5217" color="#0571b0"/>
              <sld:ColorMapEntry quantity="13.182959149322174" label="13,1830" color="#92c5de"/>
              <sld:ColorMapEntry quantity="18.844171099366093" label="18,8442" color="#f7f7f7"/>
              <sld:ColorMapEntry quantity="24.50538304941001" label="24,5054" color="#f4a582"/>
              <sld:ColorMapEntry quantity="30.166594999453928" label="30,1666" color="#ca0020"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
