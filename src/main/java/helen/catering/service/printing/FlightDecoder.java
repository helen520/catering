package helen.catering.service.printing;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolDecoderAdapter;
import org.apache.mina.filter.codec.ProtocolDecoderOutput;
  
public class FlightDecoder extends ProtocolDecoderAdapter {  
	@Override
	public void decode(IoSession session, IoBuffer buf, ProtocolDecoderOutput out)
			throws Exception {
        out.write(buf);  
	}  
  
}