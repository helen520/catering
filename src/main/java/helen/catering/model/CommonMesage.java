package helen.catering.model;


import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

public class CommonMesage {
	private String fromUsername;
	private String toStorename;
	private long createTime;
	private String msgType;
	public CommonMesage(String str){
		  Document document=null;  
          try{  
              document = DocumentHelper.parseText(str);  
          }catch(Exception e){  
              e.printStackTrace();  
          }  
          if(null==document){  
              return;  
          }  
          Element root=document.getRootElement();  
          this.fromUsername = root.elementText("FromUserName");  
          this.toStorename = root.elementText("ToUserName");  
          this.createTime = Integer.parseInt(root.elementTextTrim("CreateTime")) ;  
          this.msgType = root.elementTextTrim("MsgType");  
	}
	public CommonMesage(String fromUsername,String toUsername,int createTime,String msgType){
		 this.fromUsername = fromUsername;
         this.toStorename = toUsername;
         this.createTime = createTime; 
         this.msgType = msgType;
	}
	public CommonMesage(){
		super();
	}
	public String getFromUsername() {
		return fromUsername;
	}
	public void setFromUsername(String fromUsername) {
		this.fromUsername = fromUsername;
	}
	public String getToStorename() {
		return toStorename;
	}
	public void setToStorename(String toStorename) {
		this.toStorename = toStorename;
	}

	public long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	
}

