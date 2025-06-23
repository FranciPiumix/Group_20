<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:sld="http://www.opengis.net/sld" version="1.0.0">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_no2 _2017-2021_AAD</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="intervals">
              <sld:ColorMapEntry label="&lt;= -5,0000" quantity="-5" color="#003366"/>
              <sld:ColorMapEntry label="-5,0000 - -2,0000" quantity="-2" color="#6f8ead"/>
              <sld:ColorMapEntry label="-2,0000 - 0,0000" quantity="0" color="#abd0e3"/>
              <sld:ColorMapEntry label="0,0000 - 2,0000" quantity="2" color="#dcb8b4"/>
              <sld:ColorMapEntry label="2,0000 - 5,0000" quantity="5" color="#ca6f7d"/>
              <sld:ColorMapEntry label="> 5,0000" quantity="inf" color="#ca0020"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
