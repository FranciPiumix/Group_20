<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_CAMS_no2_2022_12</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="6.8124839541732625" label="6,8125" color="#0571b0"/>
              <sld:ColorMapEntry quantity="10.789027905111672" label="10,7890" color="#92c5de"/>
              <sld:ColorMapEntry quantity="14.76557185605008" label="14,7656" color="#f7f7f7"/>
              <sld:ColorMapEntry quantity="18.74211580698849" label="18,7421" color="#f4a582"/>
              <sld:ColorMapEntry quantity="22.718659757926901" label="22,7187" color="#ca0020"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
