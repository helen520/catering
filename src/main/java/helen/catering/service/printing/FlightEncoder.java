package helen.catering.service.printing;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolEncoderAdapter;
import org.apache.mina.filter.codec.ProtocolEncoderOutput;
  
public class FlightEncoder extends ProtocolEncoderAdapter {  
    @Override  
    public void encode(IoSession session, Object message, ProtocolEncoderOutput out) throws Exception {  
        IoBuffer buf = IoBuffer.allocate(100).setAutoExpand(true);
        buf.put((byte[])message);
        buf.flip();  
        out.write(buf);  
    }  
  
}