package helen.catering.service.printing;

import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolDecoder;
import org.apache.mina.filter.codec.ProtocolEncoder;
import org.apache.mina.filter.codec.prefixedstring.PrefixedStringCodecFactory;

public class FlightCodecFactory extends PrefixedStringCodecFactory {  
    private final ProtocolEncoder encoder = new FlightEncoder();  
    private final ProtocolDecoder decoder = new FlightDecoder();  
  
    @Override  
    public ProtocolEncoder getEncoder(IoSession session) throws Exception {  
        return encoder;  
    }
    
    @Override
    public ProtocolDecoder getDecoder(IoSession session) throws Exception {
    	return decoder;
    }
    
    public FlightCodecFactory(){
    	super();
    }
  
}  